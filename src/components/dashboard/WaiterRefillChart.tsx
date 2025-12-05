import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WaiterPerformanceMetrics } from '@/types';
import { Clock, TrendingUp } from 'lucide-react';

interface WaiterRefillChartProps {
    data: WaiterPerformanceMetrics[];
}

export function WaiterRefillChart({ data }: WaiterRefillChartProps) {
    // Color scale based on performance (green = fast, yellow = medium, red = slow)
    const getBarColor = (avgTime: number) => {
        if (avgTime <= 15) return 'hsl(var(--success))';
        if (avgTime <= 25) return 'hsl(var(--warning))';
        return 'hsl(var(--destructive))';
    };

    const chartData = data.map(waiter => ({
        name: waiter.waiterName,
        avgTime: waiter.avgResponseTimeMinutes,
        actions: waiter.totalActions,
    }));

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Média de Tempo de Reabastecimento por Garçom
                        </CardTitle>
                        <CardDescription>
                            Tempo médio entre alerta de nível baixo e ação de reabastecimento
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Últimas 24h</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        layout="horizontal"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            type="number"
                            label={{ value: 'Minutos', position: 'insideBottom', offset: -5 }}
                            className="text-xs"
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={120}
                            className="text-xs"
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="rounded-lg border bg-background p-3 shadow-md">
                                            <p className="font-semibold">{data.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Tempo médio: <span className="font-medium text-foreground">{data.avgTime} min</span>
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Total de ações: <span className="font-medium text-foreground">{data.actions}</span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Bar dataKey="avgTime" name="Tempo Médio (min)" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.avgTime)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Performance Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded" style={{ backgroundColor: 'hsl(var(--success))' }} />
                        <span className="text-muted-foreground">Rápido (≤15 min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded" style={{ backgroundColor: 'hsl(var(--warning))' }} />
                        <span className="text-muted-foreground">Médio (16-25 min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded" style={{ backgroundColor: 'hsl(var(--destructive))' }} />
                        <span className="text-muted-foreground">Lento (\u003e25 min)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
