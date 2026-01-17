'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Info, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addDays, format } from 'date-fns';

const getDays = () => {
  const base = new Date();
  return [
    { key: 'Today', label: 'Today', date: format(base, 'dd MMM') },
    { key: 'Tom', label: 'Tomorrow', date: format(addDays(base, 1), 'dd MMM') },
    { key: 'Thu', label: format(addDays(base, 2), 'EEE'), date: format(addDays(base, 2), 'dd MMM') },
    { key: 'Fri', label: format(addDays(base, 3), 'EEE'), date: format(addDays(base, 3), 'dd MMM') },
  ];
};

const menuData: { [key: string]: any } = {
  Today: {
    breakfast: [
        { id: 'today-bf-1', name: 'Aloo Paratha with Curd', description: 'Whole wheat flatbread stuffed with spiced potatoes, served with yogurt.', image: 'https://i.pinimg.com/736x/79/85/0d/79850dd005f6c6b87b7809de4583d87e.jpg', default: true, calories: 350 },
        { id: 'today-bf-2', name: 'Poha', description: 'Flattened rice with onions, potatoes, and spices.', image: 'https://i.pinimg.com/1200x/15/f6/e7/15f6e768bfe9c63fda3a3908c23f45e4.jpg', calories: 250 },
        { id: 'today-bf-3', name: 'Skip Breakfast', description: 'Help us cut down food wastage' },
    ],
    lunch: [
        { id: 'today-lunch-1', name: 'Rajma Chawal', description: 'Red kidney bean curry with steamed rice.', image: 'https://i.pinimg.com/1200x/4e/70/b9/4e70b9a62f5334ed8219d337b8aba65e.jpg', default: true, calories: 500 },
        { id: 'today-lunch-2', name: 'Kadai Paneer & Roti', description: 'Indian cottage cheese in a spicy tomato-based gravy.', image: 'https://i.pinimg.com/1200x/41/0e/aa/410eaab281a6800d9292dbdfcd193a28.jpg', calories: 600 },
    ],
    snacks: [
        { id: 'today-snacks-1', name: 'Samosa with Chutney', description: 'Fried pastry with a savory filling of spiced potatoes, onions, and peas.', image: 'https://i.pinimg.com/736x/b9/4b/39/b94b39db1d3b99b2c43074d1b06b7eba.jpg', default: true, calories: 260 },
        { id: 'today-snacks-2', name: 'Vada Pav', description: 'Deep-fried potato dumpling placed inside a bread bun.', image: 'https://i.pinimg.com/736x/b2/f5/ae/b2f5aee563003508e7fb19d47e1114cd.jpg', calories: 300 },
    ],
    dinner: [
        { id: 'today-dinner-1', name: 'Chicken Biryani', description: 'A savory chicken and rice dish with spices.', image: 'https://i.pinimg.com/736x/f4/fa/56/f4fa567df95c71408920e95fe96074d5.jpg', default: true, calories: 700 },
        { id: 'today-dinner-2', name: 'Dal Makhani with Naan', description: 'Creamy lentils with butter and spices, served with flatbread.', image: 'https://i.pinimg.com/736x/8e/5c/97/8e5c9702b53515a7bb5a75ab1885927c.jpg', calories: 650 },
    ]
  },
  Tom: {
    breakfast: [
      { id: 'tom-bf-1', name: 'Masala Dosa', description: 'A crisp and savory South Indian pancake, filled with spiced potatoes.', image: 'https://i.pinimg.com/1200x/d4/d0/55/d4d05510d95f793fd27855bbe5851f20.jpg', default: true, calories: 300 },
      { id: 'tom-bf-2', name: 'Idli Sambar', description: 'Steamed rice cakes served with a tangy lentil soup.', image: 'https://i.pinimg.com/736x/37/1c/ca/371ccade9b34b5fcd4046dd14e2c80f3.jpg', calories: 200 },
      { id: 'tom-bf-3', name: 'Skip Breakfast', description: 'Help us cut down food wastage' },
    ],
    lunch: [
      { id: 'tom-lunch-1', name: 'Chole Bhature', description: 'Spicy chickpeas with fluffy deep-fried bread.', image: 'https://i.pinimg.com/736x/ad/df/10/addf10b34621f023f039e2d16c4665db.jpg', default: true, calories: 550 },
      { id: 'tom-lunch-2', name: 'Vegetable Pulao', description: 'A fragrant rice dish with mixed vegetables and spices.', image: 'https://i.pinimg.com/736x/b3/b7/00/b3b7009a8b676ab3c3a99f3aa9a24841.jpg', calories: 400 },
    ],
    snacks: [
      { id: 'tom-snacks-1', name: 'Khandvi', description: 'Savory rolls made from gram flour, tempered with mustard seeds.', image: 'https://i.pinimg.com/736x/ed/78/39/ed78398555cdbc8f9cc37734a43f7828.jpg', default: true, calories: 150 },
      { id: 'tom-snacks-2', name: 'Dhokla', description: 'A steamed and spongy cake made from fermented rice and chickpea batter.', image: 'https://i.pinimg.com/736x/81/7e/7d/817e7dd5fe5c623f5e55621d0c9dbb38.jpg', calories: 180 },
    ],
    dinner: [
      { id: 'tom-dinner-1', name: 'Paneer Butter Masala', description: 'Cottage cheese in a creamy tomato and butter sauce.', image: 'https://i.pinimg.com/736x/da/f3/98/daf3988311896ed002a1d75f3702870c.jpg', default: true, calories: 680 },
      { id: 'tom-dinner-2', name: 'Fish Curry', description: 'A tangy and spicy fish curry, perfect with steamed rice.', image: 'https://i.pinimg.com/1200x/a5/3f/6a/a53f6a5a686b9c3ee181e9b7063e5cee.jpg', calories: 550 },
    ],
  },
  Thu: {
     breakfast: [
      { id: 'thu-bf-1', name: 'Upma', description: 'A thick porridge made from dry-roasted semolina.', image: 'https://i.pinimg.com/736x/c4/cb/35/c4cb3512cc1550fd03986563d5666f41.jpg', default: true, calories: 230 },
      { id: 'thu-bf-2', name: 'Bread Omelette', description: 'A simple yet delicious omelette sandwich.', image: 'https://i.pinimg.com/1200x/27/27/fb/2727fbef997cedbd2aa3e1e4c576f32d.jpg', calories: 320 },
      { id: 'thu-bf-3', name: 'Skip Breakfast', description: 'Help us cut down food wastage' },
    ],
    lunch: [
      { id: 'thu-lunch-1', name: 'Baingan Bharta & Roti', description: 'Smoky mashed eggplant cooked with spices.', image: 'https://i.pinimg.com/736x/de/87/99/de8799de1345fcde400c778a3390668f.jpg', default: true, calories: 450 },
      { id: 'thu-lunch-2', name: 'Lemon Rice', description: 'A tangy and flavorful rice dish with a hint of lemon and peanuts.', image: 'https://i.pinimg.com/736x/31/7c/d6/317cd62849557d086aafbdeecc29db70.jpg', calories: 380 },
    ],
    snacks: [
      { id: 'thu-snacks-1', name: 'Pakora', description: 'Assorted vegetables deep-fried in gram flour batter.', image: 'https://i.pinimg.com/1200x/b1/b0/37/b1b037bb1131982277365eda2f63ba85.jpg', default: true, calories: 200 },
      { id: 'thu-snacks-2', name: 'Aloo Chaat', description: 'Fried potato cubes tossed in spicy and tangy chutneys.', image: 'https://i.pinimg.com/736x/d2/03/3d/d2033d285f8f9e83876e6398c7494cbc.jpg', calories: 250 },
    ],
    dinner: [
      { id: 'thu-dinner-1', name: 'Mutton Rogan Josh', description: 'A fragrant lamb curry with a rich gravy.', image: 'https://i.pinimg.com/736x/9b/c0/5d/9bc05d5b3db6c1eb9323fb8257a6c560.jpg', default: true, calories: 750 },
      { id: 'thu-dinner-2', name: 'Vegetable Korma', description: 'Mixed vegetables in a creamy and mildly spiced sauce.', image: 'https://i.pinimg.com/1200x/1e/d5/06/1ed50627c27059ffe935a354969bb654.jpg', calories: 500 },
    ]
  },
  Fri: {
     breakfast: [
      { id: 'fri-bf-1', name: 'Gobi Paratha', description: 'Flatbread stuffed with spiced cauliflower.', image: 'https://i.pinimg.com/1200x/b0/80/f3/b080f30a2c6f30b6a2499a5be0c2e2d5.jpg', default: true, calories: 300 },
      { id: 'fri-bf-2', name: 'Cheela', description: 'A savory pancake made from gram flour.', image: 'https://i.pinimg.com/736x/cf/50/1d/cf501d268bcd4315c78143dd85d351c4.jpg', calories: 220 },
      { id: 'fri-bf-3', name: 'Skip Breakfast', description: 'Help us cut down food wastage' },
    ],
    lunch: [
      { id: 'fri-lunch-1', name: 'Dal Tadka & Rice', description: 'Yellow lentils tempered with spices and ghee.', image: 'https://i.pinimg.com/1200x/3e/ed/3d/3eed3dec63804510e4e6300cdbd95dec.jpg', default: true, calories: 480 },
      { id: 'fri-lunch-2', name: 'Bhindi Masala & Roti', description: 'Stir-fried okra with spices.', image: 'https://i.pinimg.com/1200x/e8/5a/6c/e85a6c32589256d7ff7b4ed8964ebbd1.jpg', calories: 420 },
    ],
    snacks: [
      { id: 'fri-snacks-1', name: 'Dahi Vada', description: 'Lentil dumplings soaked in creamy yogurt.', image: 'https://i.pinimg.com/1200x/1a/4f/b1/1a4fb162d46561bca07cf60fc31346d4.jpg', default: true, calories: 280 },
      { id: 'fri-snacks-2', name: 'Bhel Puri', description: 'A savory snack made with puffed rice, vegetables, and a tangy tamarind sauce.', image: 'https://i.pinimg.com/1200x/84/8f/4d/848f4d0ad75e8993b5126396739a2114.jpg', calories: 350 },
    ],
    dinner: [
      { id: 'fri-dinner-1', name: 'Egg Curry', description: 'Boiled eggs cooked in a spicy onion and tomato gravy.', image: 'https://i.pinimg.com/1200x/98/8c/14/988c14d330598ec327e16424a37c36d3.jpg', default: true, calories: 550 },
      { id: 'fri-dinner-2', name: 'Malai Kofta', description: 'Potato and paneer balls in a rich, creamy sauce.', image: 'https://i.pinimg.com/1200x/ce/2d/2f/ce2d2f5288ea208734decd9baba0e902.jpg', calories: 650 },
    ]
  }
};

type MenuItem = {
    id: string;
    name: string;
    description: string;
    image?: string;
    default?: boolean;
    calories?: number;
}

export function FoodMenuCard() {
  const days = getDays();
    const [selectedDay, setSelectedDay] = useState('Today');
    const [selectedMeal, setSelectedMeal] = useState<{ [key: string]: { [key: string]: string } }>({
      Today: { breakfast: 'today-bf-1', lunch: 'today-lunch-1', snacks: 'today-snacks-1', dinner: 'today-dinner-1' },
      Tom: { breakfast: 'tom-bf-1', lunch: 'tom-lunch-1', snacks: 'tom-snacks-1', dinner: 'tom-dinner-1' },
      Thu: { breakfast: 'thu-bf-1', lunch: 'thu-lunch-1', snacks: 'thu-snacks-1', dinner: 'thu-dinner-1' },
      Fri: { breakfast: 'fri-bf-1', lunch: 'fri-lunch-1', snacks: 'fri-snacks-1', dinner: 'fri-dinner-1' },
    });

    const handleSelectMeal = (mealType: string, itemId: string) => {
        setSelectedMeal(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                [mealType]: itemId
            }
        }));
    }
    
    const menu = menuData[selectedDay];
    const currentSelections = selectedMeal[selectedDay];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Menu for the week</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {days.map((day) => (
            <Button
              key={day.key}
              variant={selectedDay === day.key ? 'default' : 'outline'}
              className="h-auto w-full p-4 flex flex-col items-start"
              onClick={() => setSelectedDay(day.key)}
            >
              <div className="font-semibold">{day.label}</div>
              <div className="text-sm">{day.date}</div>
            </Button>
          ))}
        </div>

        <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                <TabsTrigger value="lunch">Lunch</TabsTrigger>
                <TabsTrigger value="snacks">Snacks</TabsTrigger>
                <TabsTrigger value="dinner">Dinner</TabsTrigger>
            </TabsList>
            <TabsContent value="breakfast">
                <RadioGroup value={currentSelections.breakfast} onValueChange={(value) => handleSelectMeal('breakfast', value)}>
                    <div className="space-y-4 pt-4">
                        {menu.breakfast.map((item: MenuItem) => (
                            <Label key={item.id} htmlFor={item.id} className={cn("flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer", currentSelections.breakfast === item.id && "bg-accent/10 border-accent")}>
                                {item.image && (
                                    <Image data-ai-hint="food meal" src={item.image} alt={item.name} width={64} height={64} className="rounded-full" />
                                )}
                                {!item.image && item.name.toLowerCase().includes('skip') && (
                                     <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <Info className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        {item.default && <Badge variant="secondary" className="mb-1">Default</Badge>}
                                        {item.calories && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Flame className="h-3 w-3 text-orange-400" />
                                                <span>~{item.calories} kcal</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <RadioGroupItem value={item.id} id={item.id} />
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
            </TabsContent>
             <TabsContent value="lunch">
                <RadioGroup value={currentSelections.lunch} onValueChange={(value) => handleSelectMeal('lunch', value)}>
                    <div className="space-y-4 pt-4">
                        {menu.lunch.map((item: MenuItem) => (
                            <Label key={item.id} htmlFor={item.id} className={cn("flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer", currentSelections.lunch === item.id && "bg-accent/10 border-accent")}>
                                {item.image && (
                                    <Image data-ai-hint="indian food" src={item.image} alt={item.name} width={64} height={64} className="rounded-full" />
                                )}
                                <div className="flex-1">
                                     <div className="flex items-center gap-2">
                                        {item.default && <Badge variant="secondary" className="mb-1">Default</Badge>}
                                        {item.calories && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Flame className="h-3 w-3 text-orange-400" />
                                                <span>~{item.calories} kcal</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <RadioGroupItem value={item.id} id={item.id} />
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
            </TabsContent>
            <TabsContent value="snacks">
                <RadioGroup value={currentSelections.snacks} onValueChange={(value) => handleSelectMeal('snacks', value)}>
                    <div className="space-y-4 pt-4">
                        {menu.snacks.map((item: MenuItem) => (
                            <Label key={item.id} htmlFor={item.id} className={cn("flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer", currentSelections.snacks === item.id && "bg-accent/10 border-accent")}>
                                {item.image && (
                                    <Image data-ai-hint="indian snacks" src={item.image} alt={item.name} width={64} height={64} className="rounded-full" />
                                )}
                                <div className="flex-1">
                                     <div className="flex items-center gap-2">
                                        {item.default && <Badge variant="secondary" className="mb-1">Default</Badge>}
                                        {item.calories && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Flame className="h-3 w-3 text-orange-400" />
                                                <span>~{item.calories} kcal</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <RadioGroupItem value={item.id} id={item.id} />
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
            </TabsContent>
            <TabsContent value="dinner">
                <RadioGroup value={currentSelections.dinner} onValueChange={(value) => handleSelectMeal('dinner', value)}>
                    <div className="space-y-4 pt-4">
                        {menu.dinner.map((item: MenuItem) => (
                            <Label key={item.id} htmlFor={item.id} className={cn("flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer", currentSelections.dinner === item.id && "bg-accent/10 border-accent")}>
                                {item.image && (
                                    <Image data-ai-hint="indian dinner" src={item.image} alt={item.name} width={64} height={64} className="rounded-full" />
                                )}
                                <div className="flex-1">
                                     <div className="flex items-center gap-2">
                                        {item.default && <Badge variant="secondary" className="mb-1">Default</Badge>}
                                        {item.calories && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Flame className="h-3 w-3 text-orange-400" />
                                                <span>~{item.calories} kcal</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <RadioGroupItem value={item.id} id={item.id} />
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}