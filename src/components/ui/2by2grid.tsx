import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

interface GridItem {
  title: string;
  icon: keyof typeof Icons;
  text: string;
}

interface TwoByTwoGridProps {
  items: GridItem[];
}

export function TwoByTwoGrid({ items }: TwoByTwoGridProps) {
  return (
    <div className="grid grid-cols-2 max-w-4xl mx-auto rounded-xl overflow-hidden">
      {items.map((item, i) => {
        const Icon = Icons[item.icon];
        return (
          <Card 
            key={i} 
            className={`aspect-square overflow-hidden border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/50 bg-zinc-100 ${
              i === 0 ? 'rounded-tl-lg' : 
              i === 1 ? 'rounded-tr-lg' : 
              i === 2 ? 'rounded-bl-lg' : 
              'rounded-br-lg'
            } rounded-none`}
          >
            <div className="flex flex-col h-full">
              <div className="h-2/3 flex items-center justify-center p-6">
                <Icon className="w-16 h-16 text-primary" />
              </div>
              <div className="h-1/3 p-4 flex flex-col items-center justify-center gap-2">
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="text-sm sm:text-base text-center">{item.text}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
