import * as React from "react"
import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from 'lucide-react'

export interface SceneParams {
  iorR: number;
  iorG: number;
  iorB: number;
  fresnelPower: number;
  opacity: number;
  roughness: number;
  metalness: number;
  reflectivity: number;
  chromaticAberration: number;
  refractionRatio: number;
  pointLightIntensity: number;
  pointLightDistance: number;
  pointLightDecay: number;
  ambientLightIntensity: number;
}

interface SceneControlsProps {
  onUpdate: (params: SceneParams) => void;
  initialParams?: SceneParams;
}

export const SceneControls: React.FC<SceneControlsProps> = ({ onUpdate, initialParams }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [params, setParams] = useState<SceneParams>(initialParams || {
    iorR: 1.14,
    iorG: 1.16,
    iorB: 1.18,
    fresnelPower: 2.0,
    opacity: 1.0,
    roughness: 0.0,
    metalness: 0.0,
    reflectivity: 0.5,
    chromaticAberration: 0.02,
    refractionRatio: 0.15,
    pointLightIntensity: 2.0,
    pointLightDistance: 50,
    pointLightDecay: 2.0,
    ambientLightIntensity: 0.2,
  });

  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
  }, [initialParams]);

  useEffect(() => {
    onUpdate(params);
  }, [params, onUpdate]);

  return (
    <div className="fixed right-0 top-8 transform transition-transform duration-300 z-[9999]"
         style={{ transform: `translateX(${isOpen ? '0' : 'calc(100% - 2rem)'})` }}>
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute -left-12 top-4 bg-black/80 hover:bg-black/60 text-white border-white/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <Card className="w-80 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Glass Material</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">IOR Red ({params.iorR.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.iorR]}
                    min={1.0}
                    max={2.0}
                    step={0.01}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, iorR: value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">IOR Green ({params.iorG.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.iorG]}
                    min={1.0}
                    max={2.0}
                    step={0.01}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, iorG: value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">IOR Blue ({params.iorB.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.iorB]}
                    min={1.0}
                    max={2.0}
                    step={0.01}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, iorB: value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Fresnel Power ({params.fresnelPower.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.fresnelPower]}
                    min={0.0}
                    max={5.0}
                    step={0.1}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, fresnelPower: value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Opacity ({params.opacity.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.opacity]}
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, opacity: value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Roughness ({params.roughness.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.roughness]}
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, roughness: value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Metalness ({params.metalness.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.metalness]}
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, metalness: value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Reflectivity ({params.reflectivity.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.reflectivity]}
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, reflectivity: value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Chromatic Aberration ({params.chromaticAberration.toFixed(3)})</Label>
                  <Slider
                    defaultValue={[params.chromaticAberration]}
                    min={0.0}
                    max={0.1}
                    step={0.001}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, chromaticAberration: value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Refraction Ratio ({params.refractionRatio.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.refractionRatio]}
                    min={0.0}
                    max={0.5}
                    step={0.01}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, refractionRatio: value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Lighting</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Point Light Intensity ({params.pointLightIntensity.toFixed(1)})</Label>
                  <Slider
                    defaultValue={[params.pointLightIntensity]}
                    min={0.0}
                    max={5.0}
                    step={0.1}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, pointLightIntensity: value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Point Light Distance ({params.pointLightDistance.toFixed(0)})</Label>
                  <Slider
                    defaultValue={[params.pointLightDistance]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, pointLightDistance: value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Point Light Decay ({params.pointLightDecay.toFixed(1)})</Label>
                  <Slider
                    defaultValue={[params.pointLightDecay]}
                    min={1.0}
                    max={3.0}
                    step={0.1}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, pointLightDecay: value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Ambient Light ({params.ambientLightIntensity.toFixed(2)})</Label>
                  <Slider
                    defaultValue={[params.ambientLightIntensity]}
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    onValueChange={([value]) => setParams(prev => ({ ...prev, ambientLightIntensity: value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
