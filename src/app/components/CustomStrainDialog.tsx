import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, Sparkles, Info } from "lucide-react";
import { toast } from "sonner";
import { Strain, terpenes, cannabinoids } from "../data/cannabisData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface CustomStrainDialogProps {
  onStrainCreated: (strain: Strain) => void;
}

export function CustomStrainDialog({ onStrainCreated }: CustomStrainDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"sativa" | "indica" | "hybrid">("hybrid");
  
  // Cannabinoid percentages
  const [thc, setThc] = useState(20);
  const [cbd, setCbd] = useState(0);
  const [cbn, setCbn] = useState(0);
  const [cbg, setCbg] = useState(0);
  
  // Selected terpenes (max 3)
  const [selectedTerpenes, setSelectedTerpenes] = useState<string[]>([]);

  const resetForm = () => {
    setName("");
    setType("hybrid");
    setThc(20);
    setCbd(0);
    setCbn(0);
    setCbg(0);
    setSelectedTerpenes([]);
  };

  const handleTerpeneToggle = (terpeneName: string) => {
    if (selectedTerpenes.includes(terpeneName)) {
      setSelectedTerpenes(selectedTerpenes.filter((t) => t !== terpeneName));
    } else {
      if (selectedTerpenes.length >= 3) {
        toast.warning("Maximum 3 dominant terpenes", {
          description: "Remove one to add another",
        });
        return;
      }
      setSelectedTerpenes([...selectedTerpenes, terpeneName]);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a strain name");
      return;
    }

    const newStrain: Strain = {
      name: name.trim(),
      type,
      isCustom: true,
      cannabinoids: {
        thc: parseFloat(thc.toFixed(1)),
        cbd: parseFloat(cbd.toFixed(1)),
        cbn: parseFloat(cbn.toFixed(1)),
        cbg: parseFloat(cbg.toFixed(1)),
      },
      terpenes: selectedTerpenes,
      thcMin: thc,
      thcMax: thc,
      description: `Custom ${type} strain`,
    };

    onStrainCreated(newStrain);
    toast.success("Custom strain created!", {
      description: `${name} is ready to use`,
    });
    setIsOpen(false);
    resetForm();
  };

  const getTerpeneColor = (terpeneName: string) => {
    const terpene = terpenes[terpeneName];
    const colorMap: Record<string, string> = {
      purple: "bg-purple-600",
      yellow: "bg-yellow-600",
      green: "bg-green-600",
      orange: "bg-orange-600",
      amber: "bg-amber-600",
      blue: "bg-blue-600",
    };
    return colorMap[terpene.color] || "bg-gray-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-green-700/30 text-green-400 hover:bg-green-900/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Strain
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-green-700/30 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-500" />
            Create Custom Strain
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Build your strain profile with cannabinoids and terpenes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Strain Name *</Label>
              <Input
                placeholder="e.g., My Purple Kush"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-900 border-green-700/30 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Type</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger className="bg-gray-900 border-green-700/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-green-700/30 text-white">
                  <SelectItem value="sativa">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600">Sativa</Badge>
                      <span className="text-xs text-gray-400">Energizing</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="indica">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-600">Indica</Badge>
                      <span className="text-xs text-gray-400">Relaxing</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hybrid">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-600">Hybrid</Badge>
                      <span className="text-xs text-gray-400">Balanced</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-green-700/30" />

          {/* Cannabinoids Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-green-400">🧪 Cannabinoids (The Engine)</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 border-green-700/30 text-white max-w-xs">
                    <p className="text-sm">
                      Cannabinoids bind to your endocannabinoid system and create the effects.
                      Think of them as the ENGINE that drives the experience.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* THC */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-white">THC % (Psychoactive)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 border-green-700/30 text-white max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold text-green-400">{cannabinoids.thc.description}</div>
                          <div>Effects: {cannabinoids.thc.effects.join(", ")}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  value={thc}
                  onChange={(e) => setThc(parseFloat(e.target.value) || 0)}
                  className="bg-gray-900 border-green-700/30 text-white"
                  step="0.1"
                  min="0"
                  max="40"
                />
              </div>

              {/* CBD */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-white">CBD % (Non-intoxicating)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 border-green-700/30 text-white max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold text-green-400">{cannabinoids.cbd.description}</div>
                          <div>Effects: {cannabinoids.cbd.effects.join(", ")}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  value={cbd}
                  onChange={(e) => setCbd(parseFloat(e.target.value) || 0)}
                  className="bg-gray-900 border-green-700/30 text-white"
                  step="0.1"
                  min="0"
                  max="30"
                />
              </div>

              {/* CBN */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-white">CBN % (Sleepy)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 border-green-700/30 text-white max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold text-green-400">{cannabinoids.cbn.description}</div>
                          <div>Effects: {cannabinoids.cbn.effects.join(", ")}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  value={cbn}
                  onChange={(e) => setCbn(parseFloat(e.target.value) || 0)}
                  className="bg-gray-900 border-green-700/30 text-white"
                  step="0.1"
                  min="0"
                  max="10"
                />
              </div>

              {/* CBG */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-white">CBG % (Subtle)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 border-green-700/30 text-white max-w-xs">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold text-green-400">{cannabinoids.cbg.description}</div>
                          <div>Effects: {cannabinoids.cbg.effects.join(", ")}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  value={cbg}
                  onChange={(e) => setCbg(parseFloat(e.target.value) || 0)}
                  className="bg-gray-900 border-green-700/30 text-white"
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-green-700/30" />

          {/* Terpenes Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-green-400">🌸 Dominant Terpenes (The Steering)</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 border-green-700/30 text-white max-w-xs">
                    <p className="text-sm">
                      Terpenes modify how cannabinoids feel, provide flavor/aroma.
                      They're the STEERING WHEEL - they guide the experience.
                      ⚠️ Fragile! Evaporate during cooking.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <p className="text-sm text-gray-400">
              Select up to 3 dominant terpenes ({selectedTerpenes.length}/3 selected)
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(terpenes).map(([key, terpene]) => {
                const isSelected = selectedTerpenes.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => handleTerpeneToggle(key)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-green-500 bg-green-900/30"
                        : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {terpene.name}
                          <Badge className={getTerpeneColor(key)} style={{ fontSize: "10px", padding: "2px 6px" }}>
                            {terpene.aroma.split(",")[0]}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400">{terpene.aroma}</div>
                      </div>
                      {isSelected && <Badge className="bg-green-600">✓</Badge>}
                    </div>
                    <div className="text-xs text-gray-400">
                      {terpene.effects.slice(0, 2).join(", ")}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedTerpenes.length > 0 && (
              <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-700/30">
                <div className="text-sm font-semibold text-purple-400 mb-2">Your Terpene Profile:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedTerpenes.map((t) => (
                    <Badge key={t} className={getTerpeneColor(t)}>
                      {terpenes[t].name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Educational Note */}
          <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30">
            <div className="text-sm font-semibold text-yellow-400 mb-1">🧠 Remember:</div>
            <p className="text-xs text-gray-400">
              Two strains with the same THC% can feel totally different!
              It's the combination of cannabinoids + terpenes (the "entourage effect") that creates unique experiences.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleCreate} className="flex-1 bg-green-600 hover:bg-green-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Custom Strain
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-green-700/30 text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
