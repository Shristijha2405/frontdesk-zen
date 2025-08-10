import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, User, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import AddAppointmentDialog from '@/components/dialogs/AddAppointmentDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'booked' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments((data || []).map(a => ({
        ...a,
        status: a.status as 'booked' | 'completed' | 'cancelled' | 'rescheduled'
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load appointments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.patient_phone.includes(searchTerm)
  );

  const todayAppointments = filteredAppointments.filter(apt => apt.appointment_date === new Date().toISOString().split('T')[0]);
  const bookedAppointments = filteredAppointments.filter(apt => apt.status === 'booked');
  const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed');
  const cancelledAppointments = filteredAppointments.filter(apt => apt.status === 'cancelled');

  const handleStatusUpdate = async (id: string, newStatus: Appointment['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: newStatus } : apt
      ));

      toast({
        title: "Success!",
        description: `Appointment ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'booked': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      case 'rescheduled': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="shadow-card-medical hover:shadow-medical transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{appointment.patient_name}</h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{appointment.patient_phone}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{appointment.doctor_name}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{appointment.appointment_date}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{appointment.appointment_time}</span>
          </div>
        </div>

        {appointment.notes && (
          <p className="text-sm text-muted-foreground mb-4 p-2 bg-secondary/50 rounded">
            {appointment.notes}
          </p>
        )}

        <div className="flex space-x-2">
          {appointment.status === 'booked' && (
            <>
              <Button 
                size="sm" 
                onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                className="bg-success hover:bg-success/90"
              >
                Complete
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleStatusUpdate(appointment.id, 'rescheduled')}
              >
                Reschedule
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
              >
                Cancel
              </Button>
            </>
          )}
          {appointment.status === 'completed' && (
            <Button size="sm" variant="outline" disabled>
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Appointment Management</h1>
              <p className="text-muted-foreground">Book, reschedule, and manage patient appointments</p>
            </div>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-primary shadow-medical"
            >
              <Plus className="w-4 h-4 mr-2" />
              Book New Appointment
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Today's Appointments"
              value={todayAppointments.length}
              icon={Calendar}
              variant="primary"
            />
            <StatsCard
              title="Booked"
              value={bookedAppointments.length}
              icon={Clock}
              variant="accent"
            />
            <StatsCard
              title="Completed"
              value={completedAppointments.length}
              icon={User}
              variant="success"
            />
            <StatsCard
              title="Cancelled"
              value={cancelledAppointments.length}
              icon={Calendar}
              variant="warning"
            />
          </div>

          {/* Search */}
          <Card className="shadow-card-medical">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments by patient name, doctor, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appointments Tabs */}
          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="today">
                Today ({todayAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="booked">
                Booked ({bookedAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({filteredAppointments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-medical-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading appointments...</p>
                </div>
              ) : todayAppointments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {todayAppointments.map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <Card className="shadow-card-medical">
                  <CardContent className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Appointments Today</h3>
                    <p className="text-muted-foreground">No appointments scheduled for today</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="booked" className="space-y-4">
              {bookedAppointments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {bookedAppointments.map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <Card className="shadow-card-medical">
                  <CardContent className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Booked Appointments</h3>
                    <p className="text-muted-foreground">All appointments have been completed or cancelled</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedAppointments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {completedAppointments.map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <Card className="shadow-card-medical">
                  <CardContent className="text-center py-12">
                    <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Completed Appointments</h3>
                    <p className="text-muted-foreground">Completed appointments will appear here</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {cancelledAppointments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {cancelledAppointments.map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <Card className="shadow-card-medical">
                  <CardContent className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Cancelled Appointments</h3>
                    <p className="text-muted-foreground">Cancelled appointments will appear here</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <AddAppointmentDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            onAppointmentAdded={fetchAppointments}
          />
        </main>
      </div>
    </div>
  );
}