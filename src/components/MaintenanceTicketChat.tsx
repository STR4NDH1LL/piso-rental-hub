import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Send, Upload, X, Image, Clock, User, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceTicketChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: {
    id: string;
    title: string;
    description: string;
    property: string;
    status: string;
    priority: string;
    reportedDate: string;
    tenant?: string;
  };
}

const MaintenanceTicketChat = ({ open, onOpenChange, ticket }: MaintenanceTicketChatProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [messages, setMessages] = useState<Array<{
    id: number;
    type: string;
    content: string;
    timestamp: string;
    sender: string;
    photos?: string[];
  }>>([
    {
      id: 1,
      type: "system",
      content: `Maintenance ticket created: ${ticket.title}`,
      timestamp: ticket.reportedDate,
      sender: "System"
    },
    {
      id: 2,
      type: "user",
      content: ticket.description,
      timestamp: ticket.reportedDate,
      sender: ticket.tenant || "Tenant"
    },
    {
      id: 3,
      type: "status",
      content: `Status updated to: ${ticket.status}`,
      timestamp: "1 hour ago",
      sender: "System"
    },
    {
      id: 4,
      type: "landlord",
      content: "I've contacted our maintenance team and they will be there tomorrow morning between 9-11 AM.",
      timestamp: "30 minutes ago",
      sender: "Property Manager"
    }
  ]);
  const [newStatus, setNewStatus] = useState(ticket.status);

  const statusOptions = ["Pending", "In Progress", "Urgent", "Completed"];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Please select only image files",
        variant: "destructive"
      });
    }
    
    setPhotos(prev => [...prev, ...imageFiles].slice(0, 3)); // Max 3 photos per message
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const uploadPromises = photos.map(async (photo, index) => {
      const fileName = `${userId}/${ticket.id}/${Date.now()}-${index}-${photo.name}`;
      
      const { error } = await supabase.storage
        .from('maintenance-photos')
        .upload(fileName, photo);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('maintenance-photos')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSendMessage = async () => {
    if (!message.trim() && photos.length === 0) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let photoUrls: string[] = [];
      if (photos.length > 0) {
        photoUrls = await uploadPhotos(user.id);
      }

      const newMessage = {
        id: messages.length + 1,
        type: "user",
        content: message,
        photos: photoUrls,
        timestamp: "Just now",
        sender: user.email || "You"
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage("");
      setPhotos([]);

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully"
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = () => {
    if (newStatus === ticket.status) return;

    const statusMessage = {
      id: messages.length + 1,
      type: "status",
      content: `Status updated from "${ticket.status}" to "${newStatus}"`,
      timestamp: "Just now",
      sender: "System"
    };

    setMessages(prev => [...prev, statusMessage]);
    
    toast({
      title: "Status updated",
      description: `Ticket status changed to ${newStatus}`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {ticket.title}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>{ticket.property} • Reported {ticket.reportedDate}</span>
            <div className="flex items-center gap-2">
              <Badge variant={ticket.priority === "Urgent" ? "destructive" : "secondary"}>
                {ticket.priority}
              </Badge>
              <Badge variant={ticket.status === "Completed" ? "default" : "outline"}>
                {ticket.status}
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                    <div className={`flex gap-3 max-w-[70%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {msg.type === 'system' ? (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        msg.type === 'user' ? 'bg-primary text-primary-foreground' :
                        msg.type === 'system' ? 'bg-muted' :
                        msg.type === 'status' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
                        'bg-muted'
                      }`}>
                        <p className="text-sm font-medium">{msg.sender}</p>
                        <p className="text-sm">{msg.content}</p>
                        {msg.photos && msg.photos.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {msg.photos.map((photo, index) => (
                              <img 
                                key={index}
                                src={photo} 
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="border-t p-4 space-y-3">
              {/* Photo Previews */}
              {photos.length > 0 && (
                <div className="flex gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="chat-photo-upload"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('chat-photo-upload')?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-80 border-l p-4 space-y-4">
            <div>
              <Label htmlFor="status-update">Update Status</Label>
              <div className="flex gap-2 mt-2">
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="flex-1 p-2 border rounded"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <Button size="sm" onClick={handleStatusUpdate}>
                  Update
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Contact Tenant
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Wrench className="h-4 w-4 mr-2" />
                  Assign Contractor
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Visit
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Ticket Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Priority:</span>
                  <Badge variant={ticket.priority === "Urgent" ? "destructive" : "secondary"} className="ml-2">
                    {ticket.priority}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Reported by:</span>
                  <p className="text-muted-foreground">{ticket.tenant}</p>
                </div>
                <div>
                  <span className="font-medium">Property:</span>
                  <p className="text-muted-foreground">{ticket.property}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceTicketChat;