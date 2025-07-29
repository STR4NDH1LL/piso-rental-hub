import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Calendar, User, MapPin, AlertTriangle } from "lucide-react";

interface MaintenanceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: {
    title: string;
    description: string;
    property: string;
    status: string;
    priority: string;
    reportedDate: string;
    tenant?: string;
  };
}

const MaintenanceDetailDialog = ({ open, onOpenChange, request }: MaintenanceDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            {request.title}
          </DialogTitle>
          <DialogDescription>Maintenance request details</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Request Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Property</span>
              </div>
              <p className="text-sm text-muted-foreground">{request.property}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Reported</span>
              </div>
              <p className="text-sm text-muted-foreground">{request.reportedDate}</p>
            </div>
            
            {request.tenant && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Reported by</span>
                </div>
                <p className="text-sm text-muted-foreground">{request.tenant}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Priority</span>
              </div>
              <Badge variant={request.priority === "High" ? "destructive" : "secondary"}>
                {request.priority}
              </Badge>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <span className="font-medium">Description</span>
            <p className="text-sm text-muted-foreground p-3 border rounded-lg bg-muted/50">
              {request.description}
            </p>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Current Status</p>
              <p className="text-sm text-muted-foreground">Last updated 2 hours ago</p>
            </div>
            <Badge variant={request.status === "Urgent" ? "destructive" : "default"}>
              {request.status}
            </Badge>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">Update Status</Button>
            <Button variant="outline" className="flex-1">Assign Contractor</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceDetailDialog;