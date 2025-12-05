import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AlertFrequencyData } from '@/types';
import { MapPin, AlertTriangle } from 'lucide-react';

interface AlertFrequencyChartProps {
    data: AlertFrequencyData[];
}

export function AlertFrequencyChart({ data }: AlertFrequencyChartProps) {
    const chartData = data.map(zone => ({
        name: zone.zoneName,
        location: zone.locationName,
        total: zone.alertCount,
        critical: zone.criticalCount,
        warning: zone.warningCount,
        info: zone.infoCount,
    }));

    // Calculate max value for color intensity
    const maxAlerts = Math.max(...chartData.map(d => d.total));

    const getBarColor = (count: number) => {
        const intensity = count / maxAlerts;
        if (intensity > 0.7) return 'hsl(var(--destructive))';
        if (intensity > 0.4) return 'hsl(var(--warning))';
        return 'hsl(var(--primary))';
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Frequência de Alertas por Zona
                        </CardTitle>
                        <CardDescription>
                            Identificação de áreas com maior necessidade de atenção
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{data.reduce((sum, z) => sum + z.alertCount, 0)} alertas totais</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            className="text-xs"
                        />
                        <YAxis
                            label={{ value: 'Número de Alertas', angle: -90, position: 'insideLeft' }}
                            className="text-xs"
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="rounded-lg border bg-background p-3 shadow-md">
                                            <p className="font-semibold">{data.name}</p>
                                            <p className="text-xs text-muted-foreground mb-2">{data.location}</p>
                                            <div className="space-y-1 text-sm">
                                                <p className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Total:</span>
                                                    <span className="font-medium">{data.total}</span>
                                                </p>
                                                {data.critical > 0 && (
                                                    <p className="flex justify-between gap-4 text-destructive">
                                                        <span>Críticos:</span>
                                                        <span className="font-medium">{data.critical}</span>
                                                    </p>
                                                )}
                                                {data.warning > 0 && (
                                                    <p className="flex justify-between gap-4 text-warning">
                                                        <span>Avisos:</span>
                                                        <span className="font-medium">{data.warning}</span>
                                                    </p>
                                                )}
                                                {data.info > 0 && (
                                                    <p className="flex justify-between gap-4 text-blue-500">
                                                        <span>Info:</span>
                                                        <span className="font-medium">{data.info}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Bar dataKey="total" name="Total de Alertas" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.total)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Zone Insights */}
                {data.length > 0 && (
                    <div className="mt-4 rounded-lg bg-muted/50 p-3">
                        <p className="text-sm font-medium mb-2">Insights:</p>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                            <li>
                                • Zona com mais alertas: <span className="font-medium text-foreground">{data[0].zoneName}</span> ({data[0].alertCount} alertas)
                            </li>
                            {data[0].criticalCount > 0 && (
                                <li className="text-destructive">
                                    • {data[0].criticalCount} alerta{data[0].criticalCount > 1 ? 's' : ''} crítico{data[0].criticalCount > 1 ? 's' : ''} nesta zona
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
