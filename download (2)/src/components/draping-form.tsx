'use client';

import type { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { FileUp, Loader2, WandSparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';

export interface DrapingFormState {
  fabricImage: string | null;
  fabricFileName: string;
  modelImage: string | null;
  pose: string;
}

interface DrapingFormProps {
  formState: DrapingFormState;
  setFormState: Dispatch<SetStateAction<DrapingFormState>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const posePresets = [
  'Front-facing standing pose',
  'Elegant side profile',
  'Graceful seated pose',
  'Dynamic walking motion',
];

export function DrapingForm({
  formState,
  setFormState,
  onSubmit,
  isLoading,
}: DrapingFormProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          fabricImage: e.target?.result as string,
          fabricFileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleModelSelect(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelSelect = (value: string) => {
    setFormState((prev) => ({ ...prev, modelImage: value }));
  };

  const handlePoseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, pose: e.target.value }));
  };

  const handlePosePresetClick = (preset: string) => {
    setFormState((prev) => ({ ...prev, pose: preset }));
  };

  const isCustomModelSelected =
    formState.modelImage &&
    !PlaceHolderImages.some((p) => p.imageUrl === formState.modelImage);

  return (
    <Card className="w-full shadow-xl bg-card border rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-4xl text-foreground">
          Create Your Drape
        </CardTitle>
        <CardDescription>Follow the steps below to generate your image.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-10 pt-4">
        <div className="space-y-4">
          <Label className="text-xl font-semibold flex items-center font-headline">
            <span className="flex-shrink-0 mr-4 bg-primary text-primary-foreground h-10 w-10 rounded-lg text-lg flex items-center justify-center">1</span>
            Upload Saree Fabric
          </Label>
          <div className="flex items-center space-x-4 pl-14">
            <Label
              htmlFor="fabric-upload"
              className="flex-shrink-0 cursor-pointer"
            >
              <Button asChild variant="outline">
                <div>
                  <FileUp className="mr-2 h-4 w-4" />
                  Choose File
                </div>
              </Button>
            </Label>
            <Input
              id="fabric-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            {formState.fabricImage ? (
              <div className="flex items-center space-x-3">
                <Image
                  src={formState.fabricImage}
                  alt="Fabric preview"
                  width={48}
                  height={48}
                  className="rounded-lg object-cover border-2 border-border"
                />
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {formState.fabricFileName}
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No file selected.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-xl font-semibold flex items-center font-headline">
            <span className="flex-shrink-0 mr-4 bg-primary text-primary-foreground h-10 w-10 rounded-lg text-lg flex items-center justify-center">2</span>
            Select a Model
          </Label>
          <div className="space-y-4 pl-14">
            <RadioGroup
              value={formState.modelImage ?? undefined}
              onValueChange={handleModelSelect}
              className="w-full"
              disabled={isLoading}
            >
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 pb-4">
                  <Input
                    id="model-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleModelFileChange}
                    disabled={isLoading}
                  />

                  <Label
                    htmlFor="model-upload"
                    className={cn(
                        'block cursor-pointer rounded-xl border-2 transition-all',
                        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        isCustomModelSelected
                          ? 'border-primary ring-2 ring-primary'
                          : 'border-transparent hover:border-primary/50'
                      )}
                  >
                    <Card className="relative overflow-hidden shadow-md hover:shadow-lg transition-shadow w-[120px] h-[180px] rounded-lg flex flex-col items-center justify-center bg-secondary/30 hover:bg-secondary/50">
                      {isCustomModelSelected && formState.modelImage ? (
                        <>
                          <Image
                            src={formState.modelImage}
                            alt="Custom model"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                             <CheckCircle2 className="h-8 w-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-xs font-semibold text-center text-muted-foreground px-2">
                            Upload Your Photo
                          </span>
                        </>
                      )}
                    </Card>
                  </Label>

                  {PlaceHolderImages.map((image) => (
                    <RadioGroupItem
                      key={image.id}
                      value={image.imageUrl}
                      id={image.id}
                      className="sr-only"
                    />
                  ))}
                  {PlaceHolderImages.map((image) => (
                    <Label
                      key={`label-${image.id}`}
                      htmlFor={image.id}
                      className={cn(
                        'block cursor-pointer rounded-xl border-2 transition-all',
                        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        formState.modelImage === image.imageUrl
                          ? 'border-primary ring-2 ring-primary'
                          : 'border-transparent hover:border-primary/50'
                      )}
                    >
                      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow w-[120px] h-[180px] rounded-lg">
                        <div className="relative w-full h-full aspect-[2/3]">
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            data-ai-hint={image.imageHint}
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, 120px"
                          />
                        </div>
                      </Card>
                    </Label>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="pose-description" className="text-xl font-semibold flex items-center font-headline">
            <span className="flex-shrink-0 mr-4 bg-primary text-primary-foreground h-10 w-10 rounded-lg text-lg flex items-center justify-center">3</span>
            Describe the Pose (Optional)
          </Label>
          <div className="pl-14">
            <Textarea
              id="pose-description"
              placeholder="e.g., 'Standing with hand on hip, slight smile'"
              value={formState.pose}
              onChange={handlePoseChange}
              className="resize-none bg-secondary/50"
              rows={3}
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {posePresets.map((preset) => (
                <Button
                  key={preset}
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePosePresetClick(preset)}
                  disabled={isLoading}
                  className="rounded-full"
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full text-lg font-bold !mt-12 py-7 rounded-xl"
          onClick={onSubmit}
          disabled={
            isLoading || !formState.fabricImage || !formState.modelImage
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
            </>
          ) : (
            <>
            <WandSparkles className="mr-2 h-5 w-5" />
            Drape with AI
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
