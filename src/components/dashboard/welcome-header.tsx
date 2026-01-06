import { Hand } from 'lucide-react';

type WelcomeHeaderProps = {
  name: string;
};

export default function WelcomeHeader({ name }: WelcomeHeaderProps) {
  const
   
  currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting;

  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="font-headline text-3xl font-bold tracking-tighter">
        {greeting}, {name.split(' ')[0]}!
      </h1>
      <Hand className="h-8 w-8 text-yellow-400" />
    </div>
  );
}
