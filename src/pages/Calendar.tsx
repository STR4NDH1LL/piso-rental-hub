import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, ArrowLeft, Home, UserCheck, UserX } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

const Calendar = () => {
  const [profile, setProfile] = useState<{ role: string; user_id: string } | null>(null);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role, user_id")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setProfile(data);
        if (data.role === 'landlord') {
          await fetchEvents(user.id);
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchEvents = async (landlordId: string) => {
    try {
      // Fetch lease start/end dates from tenancies
      const { data: tenancies, error } = await supabase
        .from("tenancies")
        .select(`
          *,
          properties (name, address),
          profiles!tenancies_tenant_id_fkey (full_name)
        `)
        .eq('landlord_id', landlordId);

      if (error) throw error;

      const calendarEvents = [];
      
      tenancies?.forEach(tenancy => {
        if (tenancy.lease_start_date) {
          calendarEvents.push({
            id: `move_in_${tenancy.id}`,
            title: `Move In - ${tenancy.profiles?.full_name}`,
            date: tenancy.lease_start_date,
            type: 'move_in',
            property: tenancy.properties?.name,
            address: tenancy.properties?.address,
            tenant: tenancy.profiles?.full_name
          });
        }
        
        if (tenancy.lease_end_date) {
          calendarEvents.push({
            id: `move_out_${tenancy.id}`,
            title: `Move Out - ${tenancy.profiles?.full_name}`,
            date: tenancy.lease_end_date,
            type: 'move_out',
            property: tenancy.properties?.name,
            address: tenancy.properties?.address,
            tenant: tenancy.profiles?.full_name
          });
        }
      });

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      format(parseISO(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getEventsForMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isWithinInterval(eventDate, { start, end });
    });
  };

  if (!profile) return <div>Loading...</div>;

  if (profile.role !== 'landlord') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">Calendar is only available for landlords.</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const monthEvents = selectedDate ? getEventsForMonth(selectedDate) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Calendar</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Property Calendar
            </CardTitle>
            <CardDescription>
              Track move-in dates, move-out dates, and property inspections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                event: events.map(event => parseISO(event.date))
              }}
              modifiersStyles={{
                event: { backgroundColor: 'hsl(var(--primary))', color: 'white' }
              }}
            />
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a Date'}
            </CardTitle>
            <CardDescription>
              Events for the selected date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {event.type === 'move_in' ? (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-600" />
                      )}
                      <Badge variant={event.type === 'move_in' ? 'default' : 'destructive'}>
                        {event.type === 'move_in' ? 'Move In' : 'Move Out'}
                      </Badge>
                    </div>
                    <p className="font-medium">{event.tenant}</p>
                    <p className="text-sm text-muted-foreground">{event.property}</p>
                    <p className="text-xs text-muted-foreground">{event.address}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No events for this date
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'Monthly'} Overview
          </CardTitle>
          <CardDescription>
            All events for the selected month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthEvents.length > 0 ? (
              monthEvents
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {event.type === 'move_in' ? (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{event.tenant}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.property} • {format(parseISO(event.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={event.type === 'move_in' ? 'default' : 'destructive'}>
                      {event.type === 'move_in' ? 'Move In' : 'Move Out'}
                    </Badge>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No events for this month
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;