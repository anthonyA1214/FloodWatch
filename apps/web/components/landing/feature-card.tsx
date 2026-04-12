import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function FeatureCard({
  imageSrc,
  title,
  description,
  color,
}: {
  imageSrc: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Card className='group relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(0,102,204,0.3)] hover:-translate-y-2 border-gray-200/60 bg-white/80 backdrop-blur-xl'>
      {/* Top Glowing Accent Line */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${color} opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_10px_currentColor] transition-all duration-300`}
      />

      <CardHeader className='flex flex-col items-center gap-6 pt-12 pb-4'>
        {/* Image Container with Hover Scale */}
        <div className='relative w-32 h-32 sm:w-40 sm:h-40 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110'>
          <Image
            src={imageSrc}
            alt={`${title} illustration`}
            fill
            className='object-contain'
            priority
          />
        </div>
        <CardTitle className='font-poppins text-2xl md:text-3xl font-bold text-center mt-4 tracking-tight'>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription className='text-base md:text-lg text-gray-600 text-center leading-relaxed'>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
