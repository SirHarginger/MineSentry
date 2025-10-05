import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Map, Layers, Clock, Settings } from 'lucide-react';

interface SidebarProps {
  onAnalyze: (location: string, tileSize: number) => void;
}

export function Sidebar({ onAnalyze }: SidebarProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('tarkwa');
  const [tileSize, setTileSize] = useState<number>(256);
  const [timeSlider, setTimeSlider] = useState([2025]);
  const [overlays, setOverlays] = useState({
    rgb: true,
    sar: false,
    viirs: false,
  });

  const handleAnalyze = () => {
    onAnalyze(selectedLocation, tileSize);
  };

  return (
    <div className="w-80 bg-sidebar border-r flex flex-col h-full" data-testid="sidebar-container">
      <div className="p-4 border-b bg-sidebar">
        <h2 className="font-display font-semibold text-lg text-sidebar-foreground">Analysis Tools</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Accordion type="single" collapsible defaultValue="monitor" className="space-y-2">
          <AccordionItem value="monitor" className="border rounded-md">
            <AccordionTrigger className="px-4 hover-elevate" data-testid="accordion-monitor">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span>Monitor Hotspots</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location-select">Select Zone</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger id="location-select" data-testid="select-location">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tarkwa">Tarkwa</SelectItem>
                    <SelectItem value="obuasi">Obuasi</SelectItem>
                    <SelectItem value="damang">Damang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tile-size">Tile Size: {tileSize}px</Label>
                <Select value={tileSize.toString()} onValueChange={(v) => setTileSize(Number(v))}>
                  <SelectTrigger id="tile-size" data-testid="select-tile-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128px</SelectItem>
                    <SelectItem value="256">256px</SelectItem>
                    <SelectItem value="512">512px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAnalyze} 
                className="w-full" 
                data-testid="button-analyze"
              >
                Analyze Location
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="overlays" className="border rounded-md">
            <AccordionTrigger className="px-4 hover-elevate" data-testid="accordion-overlays">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Satellite Overlays</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="rgb-overlay" className="text-sm">Landsat RGB</Label>
                <Switch
                  id="rgb-overlay"
                  checked={overlays.rgb}
                  onCheckedChange={(checked) => setOverlays({ ...overlays, rgb: checked })}
                  data-testid="switch-rgb"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sar-overlay" className="text-sm">Sentinel-1 SAR</Label>
                <Switch
                  id="sar-overlay"
                  checked={overlays.sar}
                  onCheckedChange={(checked) => setOverlays({ ...overlays, sar: checked })}
                  data-testid="switch-sar"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="viirs-overlay" className="text-sm">VIIRS Night Lights</Label>
                <Switch
                  id="viirs-overlay"
                  checked={overlays.viirs}
                  onCheckedChange={(checked) => setOverlays({ ...overlays, viirs: checked })}
                  data-testid="switch-viirs"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="timeline" className="border rounded-md">
            <AccordionTrigger className="px-4 hover-elevate" data-testid="accordion-timeline">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Time-Lapse</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Year: {timeSlider[0]}</Label>
                <Slider
                  value={timeSlider}
                  onValueChange={setTimeSlider}
                  min={2020}
                  max={2025}
                  step={1}
                  className="w-full"
                  data-testid="slider-timeline"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2020</span>
                  <span>2025</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
