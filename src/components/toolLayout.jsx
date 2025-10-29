import React from "react";
import Title from "@/components/title";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ToolLayout = ({ title, subtitle, Icon, children }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="text-2xl font-bold">{title}</span>
        </CardTitle>
        <CardDescription>{subtitle}</CardDescription>
        <CardAction>
          <Icon />
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
