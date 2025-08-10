import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientAdded: () => void;
}

const AddPatientDialog = ({ open, onOpenChange, onPatientAdded }: AddPatientDialogProps) => {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    priority: 'false',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Get the next queue number
      const { data: lastQueue, error: queueError } = await supabase
        .from('queue')
        .select('queue_number')
        .order('queue_number', { ascending: false })
        .limit(1);

      if (queueError) throw queueError;

      const nextQueueNumber = (lastQueue?.[0]?.queue_number || 0) + 1;

      const { error } = await supabase
        .from('queue')
        .insert({
          queue_number: nextQueueNumber,
          patient_name: formData.patientName,
          phone: formData.phone,
          priority: formData.priority === 'true',
          status: formData.priority === 'true' ? 'urgent' : 'waiting',
          notes: formData.notes || null,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Patient added to queue as #${nextQueueNumber}.`,
      });

      setFormData({
        patientName: '',
        phone: '',
        priority: 'false',
        notes: ''
      });
      onPatientAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add patient to queue.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Walk-in Patient</DialogTitle>
          <DialogDescription>
            Add a patient to the waiting queue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="John Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Normal</SelectItem>
                <SelectItem value="true">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special instructions or notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add to Queue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;