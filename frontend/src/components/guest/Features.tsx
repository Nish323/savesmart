"use client";

import {
  SectionHeader,
  FeatureCard,
  featuresData
} from "@/components/guest/features";

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="主な機能" 
          description="SaveSmartの豊富な機能で、より賢い資産管理を実現します。" 
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
