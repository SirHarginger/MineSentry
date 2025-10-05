import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/firebase';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Upload, X, MapPin } from 'lucide-react';

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultLocation?: { lat: number; lng: number };
}

export function ReportModal({ open, onOpenChange, defaultLocation }: ReportModalProps) {
  const { user } = useAuth();
  const [location, setLocation] = useState(defaultLocation || { lat: 0, lng: 0 });
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location updated",
            description: "Current location detected successfully",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get current location",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!category || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit reports",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let photoUrl: string | undefined;

      if (photo) {
        const storageRef = ref(storage, `reports/${Date.now()}_${photo.name}`);
        await uploadBytes(storageRef, photo);
        photoUrl = await getDownloadURL(storageRef);
      }

      await apiRequest('POST', '/api/reports', {
        location,
        photoUrl,
        description,
        category,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
      });

      await queryClient.invalidateQueries({ queryKey: ['/api/reports'] });

      toast({
        title: "Report submitted",
        description: "Thank you for contributing to MineSentry!",
      });
      
      onOpenChange(false);
      setDescription('');
      setCategory('');
      setPhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="modal-report">
        <DialogHeader>
          <DialogTitle>Submit Community Report</DialogTitle>
          <DialogDescription>
            Help monitor illegal mining by reporting suspicious activities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Input
                value={`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                readOnly
                data-testid="input-location"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getCurrentLocation}
                data-testid="button-get-location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" data-testid="select-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Water Pollution">Water Pollution</SelectItem>
                <SelectItem value="Deforestation">Deforestation</SelectItem>
                <SelectItem value="Land Degradation">Land Degradation</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you observed..."
              maxLength={500}
              className="resize-none"
              rows={4}
              data-testid="textarea-description"
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </p>
          </div>

          <div className="space-y-2">
            <Label>Photo (optional)</Label>
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                  data-testid="img-photo-preview"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoPreview(null);
                  }}
                  data-testid="button-remove-photo"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors hover-elevate ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                data-testid="dropzone-photo"
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? 'Drop photo here' : 'Drag & drop or click to upload'}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
              data-testid="button-submit-report"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
