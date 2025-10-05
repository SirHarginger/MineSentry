import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PredictionResult } from '@shared/schema';
import { AlertTriangle, TrendingUp, Droplet, Leaf } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface PredictionPanelProps {
  prediction: PredictionResult | null;
  loading: boolean;
}

export function PredictionPanel({ prediction, loading }: PredictionPanelProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-prediction">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Analyzing satellite data...</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="flex items-center justify-center h-64 text-center p-6" data-testid="empty-prediction">
        <div className="space-y-2">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Select a hotspot or run analysis to view predictions</p>
        </div>
      </div>
    );
  }

  const riskColor = prediction.riskScore >= 66 ? 'hsl(var(--destructive))' : 
                    prediction.riskScore >= 33 ? 'hsl(var(--chart-3))' : 
                    'hsl(var(--primary))';

  const confidenceData = {
    labels: ['Optical', 'SAR'],
    datasets: [{
      data: [prediction.confidenceBreakdown.optical, prediction.confidenceBreakdown.sar],
      backgroundColor: ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'],
      borderWidth: 0,
    }]
  };

  const featureData = {
    labels: ['NDVI Drop', 'SAR Backscatter', 'Thermal Anomaly'],
    datasets: [{
      label: 'Contribution (%)',
      data: [
        prediction.features.ndviDrop,
        prediction.features.sarBackscatter,
        prediction.features.thermalAnomaly
      ],
      backgroundColor: ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--destructive))'],
      borderRadius: 4,
    }]
  };

  return (
    <div className="space-y-4 p-4" data-testid="prediction-panel">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={riskColor}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${prediction.riskScore * 3.51} 351.86`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: riskColor }} data-testid="text-risk-score">
                  {prediction.riskScore}
                </span>
                <span className="text-xs text-muted-foreground">Risk Score</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Badge 
              variant={prediction.riskScore >= 66 ? "destructive" : prediction.riskScore >= 33 ? "secondary" : "default"}
              data-testid="badge-risk-level"
            >
              {prediction.riskScore >= 66 ? 'High Risk' : prediction.riskScore >= 33 ? 'Moderate' : 'Low Risk'}
            </Badge>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground" data-testid="text-timestamp">
              Last updated: {new Date(prediction.timestamp).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="confidence" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="confidence" data-testid="tab-confidence">Confidence</TabsTrigger>
          <TabsTrigger value="features" data-testid="tab-features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="confidence" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Confidence Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center">
                <Doughnut 
                  data={confidenceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Feature Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <Bar 
                  data={featureData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Key Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">NDVI Drop</p>
                  <p className="text-xs text-muted-foreground">{prediction.features.ndviDrop}% vegetation loss</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-chart-2/10">
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">SAR Backscatter</p>
                  <p className="text-xs text-muted-foreground">{prediction.features.sarBackscatter}% signal change</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-destructive/10">
                  <Droplet className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Thermal Anomaly</p>
                  <p className="text-xs text-muted-foreground">{prediction.features.thermalAnomaly}% heat increase</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" size="sm" data-testid="button-subscribe">
          Subscribe to Alerts
        </Button>
      </div>
    </div>
  );
}
