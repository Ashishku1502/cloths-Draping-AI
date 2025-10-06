'use client';

import { useState, useEffect } from 'react';
import { DrapingForm, type DrapingFormState } from '@/components/draping-form';
import { GeneratedImage } from '@/components/generated-image';
import { Header } from '@/components/header';
import { handleDrapeSaree } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [formState, setFormState] = useState<DrapingFormState>({
    fabricImage: null,
    fabricFileName: '',
    modelImage: null,
    pose: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formState.fabricImage || !formState.modelImage) {
      toast({
        variant: 'destructive',
        title: 'Missing Inputs',
        description: 'Please upload a fabric image and select a model.',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    const response = await handleDrapeSaree({
      sareeFabricDataUri: formState.fabricImage,
      modelDataUri: formState.modelImage,
      poseDescription: formState.pose,
    });

    if (response.drapedImageDataUri) {
      setGeneratedImage(response.drapedImageDataUri);
    } else {
      toast({
        variant: 'destructive',
        title: 'Image Generation Failed',
        description:
          response.error ||
          'An unexpected error occurred. Please try again later.',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-20">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4">
            Virtual Saree Try-On
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of fashion. Upload a fabric, choose a model, and see your saree draped in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="lg:order-last">
            <GeneratedImage
              drapedImage={generatedImage}
              isLoading={isLoading}
              modelImage={formState.modelImage}
            />
          </div>
          <div className="lg:order-first">
            <DrapingForm
              formState={formState}
              setFormState={setFormState}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <Separator className="my-16 md:my-24 bg-border/50" />

        <div className="text-center">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
                <div className="p-8 bg-card rounded-2xl border hover:border-primary transition-colors duration-300 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2">
                    <div className="mb-4 text-primary bg-primary/10 h-12 w-12 rounded-lg flex items-center justify-center font-bold text-xl">1</div>
                    <h3 className="font-headline text-2xl font-semibold mb-3">Upload Fabric</h3>
                    <p className="text-muted-foreground">Provide a clear, well-lit photo of your saree fabric. Flat lays work best for accurate results.</p>
                </div>
                <div className="p-8 bg-card rounded-2xl border hover:border-primary transition-colors duration-300 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2">
                    <div className="mb-4 text-primary bg-primary/10 h-12 w-12 rounded-lg flex items-center justify-center font-bold text-xl">2</div>
                    <h3 className="font-headline text-2xl font-semibold mb-3">Select Model</h3>
                    <p className="text-muted-foreground">Choose from our diverse library of models or upload your own photo to personalize the experience.</p>
                </div>
                <div className="p-8 bg-card rounded-2xl border hover:border-primary transition-colors duration-300 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2">
                    <div className="mb-4 text-primary bg-primary/10 h-12 w-12 rounded-lg flex items-center justify-center font-bold text-xl">3</div>
                    <h3 className="font-headline text-2xl font-semibold mb-3">Generate Drape</h3>
                    <p className="text-muted-foreground">Our AI simulates realistic folds and flow, delivering a high-resolution image for your virtual try-on.</p>
                </div>
            </div>
        </div>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground border-t mt-16 md:mt-24 bg-secondary/50">
        © {year} Ashish Kumar. All rights reserved.
      </footer>
    </div>
  );
}
