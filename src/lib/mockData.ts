import type {
  Organization,
  Location,
  Zone,
  Product,
  Container,
  Device,
  Alert,
  ThresholdPolicy,
  DeviceAssignment,
  DashboardStats,
  WeightDataPoint,
  WaiterAction,
  WaiterPerformanceMetrics,
  AlertFrequencyData,
} from '@/types';

// Mock data generator with localStorage persistence
const STORAGE_KEY = 'iot_balance_data';

export interface MockDataStore {
  organizations: Organization[];
  locations: Location[];
  zones: Zone[];
  products: Product[];
  containers: Container[];
  devices: Device[];
  alerts: Alert[];
  policies: ThresholdPolicy[];
  deviceAssignments: DeviceAssignment[];
  waiterActions: WaiterAction[];
}

function generateMockData(): MockDataStore {
  const org: Organization = {
    id: 'org_1',
    name: 'Keycore Demo',
    cnpj: '12.345.678/0001-90',
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
  };

  const locations: Location[] = [
    {
      id: 'loc_1',
      organizationId: 'org_1',
      name: 'Loja Paulista',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      timezone: 'America/Sao_Paulo',
      status: 'active',
      createdAt: '2025-01-15T10:30:00Z',
    },
    {
      id: 'loc_2',
      organizationId: 'org_1',
      name: 'Loja Centro',
      address: 'Rua XV de Novembro, 500 - São Paulo, SP',
      timezone: 'America/Sao_Paulo',
      status: 'active',
      createdAt: '2025-01-15T11:00:00Z',
    },
  ];

  const zones: Zone[] = [
    {
      id: 'zone_1',
      locationId: 'loc_1',
      name: 'Bar Frontal',
      description: 'Área do bar principal',
    },
    {
      id: 'zone_2',
      locationId: 'loc_1',
      name: 'Depósito',
      description: 'Área de estoque',
    },
    {
      id: 'zone_3',
      locationId: 'loc_2',
      name: 'Bar Principal',
    },
  ];

  const products: Product[] = [
    {
      id: 'prd_1',
      organizationId: 'org_1',
      name: 'Cerveja Pilsen Premium',
      sku: 'CERV-PILS-20L',
      densityKgPerL: 1.01,
      unitLabel: 'L',
      active: true,
      createdAt: '2025-01-15T09:00:00Z',
    },
    {
      id: 'prd_2',
      organizationId: 'org_1',
      name: 'Refrigerante Cola',
      sku: 'REFR-COLA-10L',
      densityKgPerL: 1.05,
      unitLabel: 'L',
      active: true,
      createdAt: '2025-01-15T09:00:00Z',
    },
    {
      id: 'prd_3',
      organizationId: 'org_1',
      name: 'Suco Natural Laranja',
      sku: 'SUCO-LARA-5L',
      densityKgPerL: 1.02,
      unitLabel: 'L',
      active: true,
      createdAt: '2025-01-15T09:00:00Z',
    },
  ];

  const containers: Container[] = [
    {
      id: 'cont_1',
      organizationId: 'org_1',
      name: 'Barril 20L',
      tareWeightG: 2300,
      capacityL: 20,
      capacityG: 20200,
      material: 'Aço inoxidável',
      reusable: true,
      active: true,
      createdAt: '2025-01-15T09:00:00Z',
    },
    {
      id: 'cont_2',
      organizationId: 'org_1',
      name: 'Galão 10L',
      tareWeightG: 800,
      capacityL: 10,
      capacityG: 10500,
      material: 'Plástico PET',
      reusable: true,
      active: true,
      createdAt: '2025-01-15T09:00:00Z',
    },
    {
      id: 'cont_3',
      organizationId: 'org_1',
      name: 'Garrafa 5L',
      tareWeightG: 400,
      capacityL: 5,
      capacityG: 5100,
      material: 'Plástico',
      reusable: false,
      active: true,
      createdAt: '2025-01-15T09:00:00Z',
    },
  ];

  const policies: ThresholdPolicy[] = [
    {
      id: 'pol_1',
      organizationId: 'org_1',
      name: 'Alerta Crítico - 15%',
      scopeType: 'organization',
      ruleType: 'percent',
      ruleValue: 15,
      hysteresisValue: 5,
      evaluateEveryS: 60,
      minDurationS: 600,
      active: true,
      priority: 1,
      createdAt: '2025-01-15T09:00:00Z',
    },
    {
      id: 'pol_2',
      organizationId: 'org_1',
      name: 'Alerta Aviso - 30%',
      scopeType: 'organization',
      ruleType: 'percent',
      ruleValue: 30,
      hysteresisValue: 5,
      evaluateEveryS: 120,
      minDurationS: 300,
      active: true,
      priority: 2,
      createdAt: '2025-01-15T09:00:00Z',
    },
  ];

  // Generate realistic weight percentages
  const weightPercentages = [12, 28, 45, 67, 89, 8, 52, 73, 19, 91];

  const devices: Device[] = Array.from({ length: 10 }, (_, i) => {
    const percent = weightPercentages[i];
    const isLoc1 = i < 6;
    const locationId = isLoc1 ? 'loc_1' : 'loc_2';
    const zoneId = isLoc1 ? (i % 2 === 0 ? 'zone_1' : 'zone_2') : 'zone_3';

    const productIdx = i % 3;
    const product = products[productIdx];
    const container = containers[productIdx];

    const capacityG = container.capacityG || 0;
    const currentWeight = (capacityG * percent) / 100;

    const lastSeenMinutes = Math.floor(Math.random() * 30);
    const lastSeenAt = new Date(Date.now() - lastSeenMinutes * 60000).toISOString();

    const status: Device['status'] =
      lastSeenMinutes > 15 ? 'offline' :
        percent < 15 ? 'active' : 'active';

    return {
      id: `dev_${i + 1}`,
      organizationId: 'org_1',
      locationId,
      zoneId,
      serial: `KD-${String(i + 1).padStart(6, '0')}`,
      model: 'Keycore Pro v2',
      firmwareVersion: '1.2.3',
      status,
      lastSeenAt,
      batteryLevel: 0.6 + Math.random() * 0.35,
      rssi: -45 - Math.floor(Math.random() * 30),
      calibrationFactor: 1.0,
      offset: 0,
      unit: 'g' as const,
      minReportingIntervalS: 15,
      maxReportingIntervalS: 300,
      createdAt: `2025-01-${16 + Math.floor(i / 3)}T10:00:00Z`,
      currentProduct: product,
      currentContainer: container,
      currentWeight,
      currentPercent: percent,
      predictedRunoutAt: percent < 40 ?
        new Date(Date.now() + (percent / 2) * 3600000).toISOString() :
        undefined,
    };
  });

  const assignments: DeviceAssignment[] = devices.map((device, i) => ({
    id: `assign_${i + 1}`,
    deviceId: device.id,
    productId: device.currentProduct!.id,
    containerId: device.currentContainer!.id,
    startedAt: device.createdAt,
  }));

  const alerts: Alert[] = devices
    .filter(d => d.currentPercent! < 30)
    .map((device, i) => {
      const severity = device.currentPercent! < 15 ? 'critical' : 'warning';
      const policy = severity === 'critical' ? policies[0] : policies[1];

      return {
        id: `alert_${i + 1}`,
        organizationId: 'org_1',
        deviceId: device.id,
        policyId: policy.id,
        status: 'open' as const,
        severity,
        openedAt: new Date(Date.now() - Math.random() * 7200000).toISOString(),
        reasonCode: 'LOW_LEVEL',
        message: `Nível baixo detectado: ${device.currentPercent}% restante`,
        device,
        policy,
        location: locations.find(l => l.id === device.locationId),
      };
    });

  // Generate waiter actions for alerts
  const waiterNames = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Souza'];
  const waiterActions: WaiterAction[] = alerts.map((alert, i) => {
    const waiterIdx = i % waiterNames.length;
    const waiterId = `waiter_${waiterIdx + 1}`;
    const waiterName = waiterNames[waiterIdx];

    // Calculate response time (5-45 minutes)
    const responseTimeMinutes = 5 + Math.floor(Math.random() * 40);
    const actionAt = new Date(
      new Date(alert.openedAt).getTime() + responseTimeMinutes * 60000
    ).toISOString();

    const actionTypes: WaiterAction['actionType'][] = ['refill', 'swap', 'deactivate', 'acknowledge'];
    const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];

    return {
      id: `action_${i + 1}`,
      waiterId,
      waiterName,
      alertId: alert.id,
      actionType,
      actionAt,
      responseTimeMinutes,
    };
  });

  return {
    organizations: [org],
    locations,
    zones,
    products,
    containers,
    devices,
    alerts,
    policies,
    deviceAssignments: assignments,
    waiterActions,
  };
}

export function loadMockData(): MockDataStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Migrate old data structure if needed
      if (parsed.assignments && !parsed.deviceAssignments) {
        parsed.deviceAssignments = parsed.assignments;
        delete parsed.assignments;
        saveMockData(parsed);
      }

      // Ensure all required properties exist
      if (!parsed.deviceAssignments) {
        console.warn('Invalid data structure in localStorage, regenerating...');
        const data = generateMockData();
        saveMockData(data);
        return data;
      }

      return parsed;
    }
  } catch (e) {
    console.error('Error loading mock data from localStorage:', e);
  }

  const data = generateMockData();
  saveMockData(data);
  return data;
}

export function saveMockData(data: MockDataStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving mock data to localStorage:', e);
  }
}

export function getDashboardStats(data: MockDataStore): DashboardStats {
  const devices = data.devices;
  const activeDevices = devices.filter(d => d.status === 'active').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;

  const criticalAlerts = data.alerts.filter(
    a => a.status === 'open' && a.severity === 'critical'
  ).length;

  const warningAlerts = data.alerts.filter(
    a => a.status === 'open' && a.severity === 'warning'
  ).length;

  const avgBatteryLevel =
    devices.reduce((sum, d) => sum + (d.batteryLevel || 0), 0) / devices.length;

  const devicesRunningLow = devices.filter(d => (d.currentPercent || 100) < 30).length;

  return {
    totalDevices: devices.length,
    activeDevices,
    offlineDevices,
    criticalAlerts,
    warningAlerts,
    avgBatteryLevel,
    devicesRunningLow,
  };
}

export function generateWeightHistory(device: Device): WeightDataPoint[] {
  const points: WeightDataPoint[] = [];
  const now = Date.now();
  const hoursBack = 24;

  const currentWeight = device.currentWeight || 0;
  const currentPercent = device.currentPercent || 0;
  const capacityG = device.currentContainer?.capacityG || 20000;

  // Simulate gradual consumption
  const consumptionRate = (capacityG - currentWeight) / hoursBack;

  for (let i = hoursBack; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000).toISOString();
    const weight = Math.max(0, currentWeight + consumptionRate * i);
    const percent = (weight / capacityG) * 100;

    // Add some noise
    const noise = (Math.random() - 0.5) * 100;

    points.push({
      timestamp,
      weight: Math.round(weight + noise),
      percent: Math.round(percent * 10) / 10,
    });
  }

  return points;
}

export function getWaiterPerformanceMetrics(data: MockDataStore): WaiterPerformanceMetrics[] {
  const waiterMap = new Map<string, WaiterAction[]>();

  // Group actions by waiter
  data.waiterActions.forEach(action => {
    if (!waiterMap.has(action.waiterId)) {
      waiterMap.set(action.waiterId, []);
    }
    waiterMap.get(action.waiterId)!.push(action);
  });

  // Calculate metrics for each waiter
  const metrics: WaiterPerformanceMetrics[] = [];
  waiterMap.forEach((actions, waiterId) => {
    const responseTimes = actions.map(a => a.responseTimeMinutes);
    const avgResponseTimeMinutes = responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length;
    const fastestResponseMinutes = Math.min(...responseTimes);
    const slowestResponseMinutes = Math.max(...responseTimes);

    metrics.push({
      waiterId,
      waiterName: actions[0].waiterName,
      avgResponseTimeMinutes: Math.round(avgResponseTimeMinutes * 10) / 10,
      totalActions: actions.length,
      fastestResponseMinutes,
      slowestResponseMinutes,
    });
  });

  // Sort by average response time (fastest first)
  return metrics.sort((a, b) => a.avgResponseTimeMinutes - b.avgResponseTimeMinutes);
}

export function getAlertFrequencyByZone(data: MockDataStore): AlertFrequencyData[] {
  const zoneMap = new Map<string, Alert[]>();

  // Group alerts by zone
  data.alerts.forEach(alert => {
    const zoneId = alert.device?.zoneId || 'unknown';
    if (!zoneMap.has(zoneId)) {
      zoneMap.set(zoneId, []);
    }
    zoneMap.get(zoneId)!.push(alert);
  });

  // Calculate frequency data for each zone
  const frequencyData: AlertFrequencyData[] = [];
  zoneMap.forEach((alerts, zoneId) => {
    const zone = data.zones.find(z => z.id === zoneId);
    const location = data.locations.find(l => l.id === zone?.locationId);

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;
    const infoCount = alerts.filter(a => a.severity === 'info').length;

    frequencyData.push({
      zoneId,
      zoneName: zone?.name || 'Desconhecida',
      locationName: location?.name || 'Desconhecido',
      alertCount: alerts.length,
      criticalCount,
      warningCount,
      infoCount,
    });
  });

  // Sort by alert count (highest first)
  return frequencyData.sort((a, b) => b.alertCount - a.alertCount);
}

