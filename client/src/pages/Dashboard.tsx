import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapView } from '@/components/MapView';
import { Sidebar } from '@/components/Sidebar';
import { PredictionPanel } from '@/components/PredictionPanel';
import { ReportModal } from '@/components/ReportModal';
import { Button } from '@/components/ui/button';
import { Hotspot, PredictionResult } from '@shared/schema';
import { Plus } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { apiRequest } from '@/lib/queryClient';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const { data: reports } = useQuery({
    queryKey: ['/api/reports'],
  });

  const handleHotspotClick = async (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setLoading(true);

    try {
      const result = await apiRequest<PredictionResult>(
        'POST',
        '/api/predict',
        {
          location: hotspot.location,
          tileSize: 256,
        }
      );

      const predictedResult = {
        ...result,
        riskScore: hotspot.riskScore,
      };

      setPrediction(predictedResult);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (location: string, tileSize: number) => {
    setLoading(true);

    const locationCoords: { [key: string]: { lat: number; lng: number } } = {
      tarkwa: { lat: 5.2922, lng: -1.9833 },
      obuasi: { lat: 6.2019, lng: -1.6586 },
      damang: { lat: 6.0123, lng: -1.8625 },
    };

    const coords = locationCoords[location] || { lat: 6.0, lng: -1.5 };

    try {
      const result = await apiRequest<PredictionResult>(
        'POST',
        '/api/predict',
        {
          location: coords,
          tileSize,
        }
      );

      setPrediction(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] relative">
        <Sidebar onAnalyze={handleAnalyze} />
        
        <div className="flex-1 relative">
          <MapView onHotspotClick={handleHotspotClick} />
          
          <Button
            size="icon"
            className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            onClick={() => setReportModalOpen(true)}
            data-testid="button-new-report"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <div className="w-96 bg-card border-l overflow-y-auto">
          <PredictionPanel prediction={prediction} loading={loading} />
        </div>
      </div>

      <ReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        defaultLocation={selectedHotspot?.location}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
