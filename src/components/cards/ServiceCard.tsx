import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Props = {
  service: {
    id: number;
    title: string;
    description: string;
    price: number;
    ownerName: string;
    tags: string;
  };
};

export default function ServiceCard({ service }: Props) {
  const tags = service.tags?.split(",") || [];

  return (
    <Link href={`/services/${service.id}`}>
      <Card className="hover:shadow-xl transition rounded-2xl cursor-pointer">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-lg font-semibold">{service.title}</h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {service.description}
          </p>

          <p className="text-sm font-medium text-gray-800">
            by {service.ownerName}
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                {tag.trim()}
              </Badge>
            ))}
          </div>

          <p className="text-xl font-bold mt-2">${service.price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
