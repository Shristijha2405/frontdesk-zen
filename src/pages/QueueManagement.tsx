import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Clock, Users, AlertTriangle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import QueueCard from '@/components/queue/QueueCard';
import StatsCard from '@/components/dashboard/StatsCard';
import AddPatientDialog from '@/components/dialogs/AddPatientDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QueueItem {
  id: string;
  queueNumber: number;
  patientName: string;
  phone: string;
  waitTime: string;
  status: 'waiting' | 'with-doctor' | 'completed' | 'urgent';
  priority: boolean;
}

export default function QueueManagement() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('queue')
        .select('*')
        .order('queue_number', { ascending: true });

      if (error) throw error;
      
      const mappedData = (data || []).map(q => {
        const checkInTime = new Date(q.check_in_time);
        const now = new Date();
        const waitTimeMs = now.getTime() - checkInTime.getTime();
        const waitTimeMinutes = Math.floor(waitTimeMs / (1000 * 60));
        
        return {
          id: q.id,
          queueNumber: q.queue_number,
          patientName: q.patient_name,
          phone: q.phone,
          waitTime: `${waitTimeMinutes} min`,
          status: q.status as 'waiting' | 'with-doctor' | 'completed' | 'urgent',
          priority: q.priority
        };
      });
      
      setQueueItems(mappedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load queue.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: QueueItem['status']) => {
    try {
      const { error } = await supabase
        .from('queue')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setQueueItems(items => 
        items.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      fetchQueue(); // Refresh the data to update wait times

      toast({
        title: "Success!",
        description: `Patient status updated to ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update patient status.",
        variant: "destructive",
      });
    }
  };

  const filteredQueue = queueItems.filter(item =>
    item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone.includes(searchTerm)
  );

  const urgentQueue = filteredQueue.filter(item => item.status === 'urgent');
  const waitingQueue = filteredQueue.filter(item => item.status === 'waiting');
  const activeQueue = filteredQueue.filter(item => item.status === 'with-doctor');
  const completedQueue = filteredQueue.filter(item => item.status === 'completed');


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Queue Management</h1>
              <p className="text-muted-foreground">Manage patient queues and track waiting times</p>
            </div>
            <Button 
              onClick={() => setShowAddDialog(true)} 
              className="bg-gradient-primary shadow-medical"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Walk-in Patient
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Total in Queue"
              value={queueItems.filter(item => item.status !== 'completed').length}
              icon={Users}
              variant="primary"
            />
            <StatsCard
              title="Currently Waiting"
              value={waitingQueue.length}
              icon={Clock}
              variant="accent"
            />
            <StatsCard
              title="With Doctor"
              value={activeQueue.length}
              icon={Users}
              variant="success"
            />
            <StatsCard
              title="Urgent Cases"
              value={urgentQueue.length}
              icon={AlertTriangle}
              variant="warning"
            />
          </div>

          {/* Search and Filters */}
          <Card className="shadow-card-medical">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Queue Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({filteredQueue.length})
              </TabsTrigger>
              <TabsTrigger value="urgent" className="text-destructive">
                Urgent ({urgentQueue.length})
              </TabsTrigger>
              <TabsTrigger value="waiting">
                Waiting ({waitingQueue.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-success">
                With Doctor ({activeQueue.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedQueue.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-medical-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading queue...</p>
                </div>
              ) : (
                <>
                  {urgentQueue.map(item => (
                    <QueueCard 
                      key={item.id} 
                      item={item} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                  {activeQueue.map(item => (
                    <QueueCard 
                      key={item.id} 
                      item={item} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                  {waitingQueue.map(item => (
                    <QueueCard 
                      key={item.id} 
                      item={item} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                  {completedQueue.map(item => (
                    <QueueCard 
                      key={item.id} 
                      item={item} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </>
              )}
            </TabsContent>

            <TabsContent value="urgent" className="space-y-4">
              {urgentQueue.length > 0 ? (
                urgentQueue.map(item => (
                  <QueueCard 
                    key={item.id} 
                    item={item} 
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              ) : (
                <Card className="shadow-card-medical">
                  <CardContent className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Urgent Cases</h3>
                    <p className="text-muted-foreground">All patients are in normal queue</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="waiting" className="space-y-4">
              {waitingQueue.length > 0 ? (
                waitingQueue.map(item => (
                  <QueueCard 
                    key={item.id} 
                    item={item} 
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              ) : (
                <Card className="shadow-card-medical">
                  <CardContent className="text-center py-12">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Waiting Patients</h3>
                    <p className="text-muted-foreground">All patients are being attended to</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {activeQueue.length > 0 ? (
                activeQueue.map(item => (
                  <QueueCard 
                    key={item.id} 
                    item={item} 
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              ) : (
                <Card className="shadow-card-medical">
                  <CardContent className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Active Consultations</h3>
                    <p className="text-muted-foreground">No patients are currently with doctors</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedQueue.length > 0 ? (
                completedQueue.map(item => (
                  <QueueCard 
                    key={item.id} 
                    item={item} 
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              ) : (
                <Card className="shadow-card-medical">
                  <CardContent className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Completed Visits</h3>
                    <p className="text-muted-foreground">Completed patients will appear here</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <AddPatientDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            onPatientAdded={fetchQueue}
          />
        </main>
      </div>
    </div>
  );
}