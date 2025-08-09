import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building, User, Bell, Shield, Database, Clock } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-white to-medical-green/5">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your system preferences and clinic settings</p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* Clinic Information */}
              <Card className="border-medical-blue/20 shadow-medical">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-medical-blue" />
                    <CardTitle>Clinic Information</CardTitle>
                  </div>
                  <CardDescription>Update your clinic's basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinic-name">Clinic Name</Label>
                      <Input id="clinic-name" defaultValue="Allo Health Clinic" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic-phone">Phone Number</Label>
                      <Input id="clinic-phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic-address">Address</Label>
                    <Input id="clinic-address" defaultValue="123 Medical Center Drive, Healthcare City, HC 12345" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinic-email">Email</Label>
                      <Input id="clinic-email" type="email" defaultValue="info@allohealth.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic-website">Website</Label>
                      <Input id="clinic-website" defaultValue="www.allohealth.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Profile */}
              <Card className="border-medical-green/20 shadow-medical">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-medical-green" />
                    <CardTitle>User Profile</CardTitle>
                  </div>
                  <CardDescription>Manage your personal account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Front Desk Staff</h3>
                      <p className="text-sm text-muted-foreground">staff@allohealth.com</p>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Full Name</Label>
                      <Input id="user-name" defaultValue="Front Desk Staff" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email Address</Label>
                      <Input id="user-email" type="email" defaultValue="staff@allohealth.com" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Preferences */}
              <Card className="border-medical-purple/20 shadow-medical">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-medical-purple" />
                    <CardTitle>System Preferences</CardTitle>
                  </div>
                  <CardDescription>Configure notifications and system behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Queue Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified when patients join the queue</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Send automatic appointment reminders</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-refresh Dashboard</Label>
                      <p className="text-sm text-muted-foreground">Automatically update dashboard data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Alerts</Label>
                      <p className="text-sm text-muted-foreground">Play sound for urgent notifications</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card className="border-medical-orange/20 shadow-medical">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-medical-orange" />
                    <CardTitle>Working Hours</CardTitle>
                  </div>
                  <CardDescription>Set your clinic's operating hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="open-time">Opening Time</Label>
                      <Input id="open-time" type="time" defaultValue="08:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="close-time">Closing Time</Label>
                      <Input id="close-time" type="time" defaultValue="18:00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Working Days</Label>
                    <div className="flex gap-2 flex-wrap">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <Badge 
                          key={day} 
                          variant={day === 'Sunday' ? "outline" : "secondary"}
                          className="cursor-pointer hover:bg-medical-blue/10"
                        >
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card className="border-medical-red/20 shadow-medical">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-medical-red" />
                    <CardTitle>Data Management</CardTitle>
                  </div>
                  <CardDescription>Manage your data and system maintenance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Export Patient Data</h4>
                      <p className="text-sm text-muted-foreground">Download all patient records and appointments</p>
                    </div>
                    <Button variant="outline">Export</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Backup System Data</h4>
                      <p className="text-sm text-muted-foreground">Create a backup of your system configuration</p>
                    </div>
                    <Button variant="outline">Backup</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
                    <div>
                      <h4 className="font-medium text-destructive">Clear Queue History</h4>
                      <p className="text-sm text-muted-foreground">Remove completed queue entries older than 30 days</p>
                    </div>
                    <Button variant="destructive" size="sm">Clear</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Changes */}
              <div className="flex justify-end gap-4 pt-6">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-gradient-primary hover:opacity-90">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;