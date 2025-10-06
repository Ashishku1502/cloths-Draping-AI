'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, Image as ImageIcon } from 'lucide-react';
import { SareeIcon } from './icons';

interface GeneratedImageProps {
  drapedImage: string | null;
  isLoading: boolean;
  modelImage: string | null;
}

export function GeneratedImage({
  drapedImage,
  isLoading,
  modelImage
}: GeneratedImageProps) {
  const handleDownload = () => {
    if (!drapedImage) return;
    const link = document.createElement('a');
    link.href = drapedImage;
    link.download = 'draped-saree.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full lg:sticky lg:top-24 shadow-xl bg-card border-none rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-4xl">Result</CardTitle>
        <CardDescription>Your virtually draped saree appears here.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-full aspect-[9/16] max-w-sm mx-auto bg-secondary/50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed">
          {isLoading && (
            <div className='absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10'>
                <SareeIcon className="h-16 w-16 text-primary animate-pulse" />
                <p className='mt-4 font-semibold text-lg'>Draping your Saree...</p>
                <p className='text-muted-foreground text-sm'>This may take a moment.</p>
                {modelImage && <Image src={modelImage} alt="Loading background" fill className="object-cover opacity-10 blur-md" />}
            </div>
          )}
          {!isLoading && !drapedImage && (
            <div className="text-center text-muted-foreground p-8">
              <ImageIcon className="mx-auto h-16 w-16 mb-4 opacity-50" />
              <h3 className="font-semibold text-lg">Your generated image will appear here</h3>
              <p className="text-sm">
                Fill out the form to get started.
              </p>
            </div>
          )}
          {drapedImage && (
            <Image
              src={drapedImage}
              alt="AI generated draped saree"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
        <Button
          className="w-full max-w-sm mx-auto text-lg rounded-xl"
          onClick={handleDownload}
          disabled={!drapedImage || isLoading}
          size="lg"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Image
        </Button>
      </CardContent>
    </Card>
  );
}
