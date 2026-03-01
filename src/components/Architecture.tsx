import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Cpu, 
  LineChart, 
  FileText, 
  CheckCircle,
  ArrowRight 
} from "lucide-react";

const Architecture = () => {
  const pipeline = [
    {
      icon: FileText,
      title: "Data Collection",
      description: "News articles from various sources",
      color: "text-primary"
    },
    {
      icon: Database,
      title: "Preprocessing",
      description: "Text cleaning, tokenization, TF-IDF",
      color: "text-accent"
    },
    {
      icon: Cpu,
      title: "ML Models",
      description: "Ensemble of classifiers",
      color: "text-success"
    },
    {
      icon: LineChart,
      title: "Classification",
      description: "Real vs Fake prediction",
      color: "text-warning"
    },
    {
      icon: CheckCircle,
      title: "Results",
      description: "Confidence scores & analysis",
      color: "text-primary"
    }
  ];

  const technologies = [
    { name: "Natural Language Processing", category: "Core" },
    { name: "TF-IDF Vectorization", category: "Feature Extraction" },
    { name: "Logistic Regression", category: "ML Model" },
    { name: "Random Forest", category: "ML Model" },
    { name: "Naive Bayes", category: "ML Model" },
    { name: "SVM", category: "ML Model" },
    { name: "React + TypeScript", category: "Frontend" },
    { name: "Tailwind CSS", category: "Styling" }
  ];

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
          <CardDescription>
            End-to-end pipeline for fake news detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {pipeline.map((step, index) => (
              <div key={step.title} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2 min-w-[140px]">
                  <div className={`p-4 rounded-xl bg-secondary ${step.color}`}>
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < pipeline.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Tools and frameworks powering the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech.name} variant="secondary" className="text-sm py-2 px-4">
                <span className="font-semibold">{tech.name}</span>
                <span className="ml-2 text-muted-foreground">• {tech.category}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Preprocessing</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Text normalization and cleaning</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Stop words removal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Tokenization and stemming</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>TF-IDF feature extraction</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Feature vectorization</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Model Ensemble</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Multiple classifier approach</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Weighted voting mechanism</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Cross-validation for robustness</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Feature importance analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Confidence score calculation</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Architecture;
