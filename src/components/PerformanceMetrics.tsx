import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Target } from "lucide-react";

const PerformanceMetrics = () => {
  const models = [
    { name: "Logistic Regression", accuracy: 89.5, precision: 88.2, recall: 90.1, f1: 89.1 },
    { name: "Random Forest", accuracy: 92.3, precision: 91.8, recall: 92.7, f1: 92.2 },
    { name: "Naive Bayes", accuracy: 85.7, precision: 84.5, recall: 86.9, f1: 85.7 },
    { name: "SVM", accuracy: 91.2, precision: 90.5, recall: 91.8, f1: 91.1 },
    { name: "Ensemble Model", accuracy: 94.1, precision: 93.8, recall: 94.3, f1: 94.0 }
  ];

  const bestModel = models.reduce((prev, current) => 
    current.accuracy > prev.accuracy ? current : prev
  );

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Best Model Performance
              </CardTitle>
              <CardDescription>
                {bestModel.name} achieves highest accuracy
              </CardDescription>
            </div>
            <Badge className="text-2xl px-6 py-3">
              {bestModel.accuracy}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Precision</p>
              <p className="text-2xl font-bold text-primary">{bestModel.precision}%</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Recall</p>
              <p className="text-2xl font-bold text-success">{bestModel.recall}%</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">F1 Score</p>
              <p className="text-2xl font-bold text-accent">{bestModel.f1}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Model Comparison
          </CardTitle>
          <CardDescription>
            Performance metrics across different algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {models.map((model) => (
              <div key={model.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{model.name}</h3>
                    {model.name === bestModel.name && (
                      <Badge variant="default" className="text-xs">
                        Best
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {model.accuracy}%
                  </span>
                </div>
                <Progress value={model.accuracy} className="h-2" />
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>Precision: {model.precision}%</div>
                  <div>Recall: {model.recall}%</div>
                  <div>F1: {model.f1}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Key Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3 p-3 bg-success-light rounded-lg">
              <div className="flex-shrink-0 w-1 bg-success rounded-full"></div>
              <div>
                <p className="font-semibold text-foreground">High Accuracy</p>
                <p className="text-muted-foreground">
                  Ensemble model achieves 94.1% accuracy in detecting fake news
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 p-3 bg-primary/10 rounded-lg">
              <div className="flex-shrink-0 w-1 bg-primary rounded-full"></div>
              <div>
                <p className="font-semibold text-foreground">Balanced Performance</p>
                <p className="text-muted-foreground">
                  Similar precision and recall scores indicate robust classification
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 p-3 bg-accent/10 rounded-lg">
              <div className="flex-shrink-0 w-1 bg-accent rounded-full"></div>
              <div>
                <p className="font-semibold text-foreground">Feature Engineering</p>
                <p className="text-muted-foreground">
                  TF-IDF vectorization proves effective for text classification
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-warning/10 rounded-lg">
              <div className="flex-shrink-0 w-1 bg-warning rounded-full"></div>
              <div>
                <p className="font-semibold text-foreground">Ensemble Advantage</p>
                <p className="text-muted-foreground">
                  Combining multiple models improves overall performance by 2-3%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
