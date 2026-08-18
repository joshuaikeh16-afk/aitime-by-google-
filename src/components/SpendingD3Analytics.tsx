import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Transaction } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Wifi, 
  Smartphone, 
  Zap, 
  Sparkles
} from 'lucide-react';

interface SpendingD3AnalyticsProps {
  transactions: Transaction[];
  onSelectMonthFilter?: (month: string | null) => void;
}

export type ChartViewType = 'stacked' | 'donut' | 'trend';

export interface MonthlySpendData {
  monthKey: string; // e.g. "2026-08"
  monthLabel: string; // e.g. "Aug"
  fullLabel: string; // e.g. "August 2026"
  dataAmount: number;
  airtimeAmount: number;
  utilitiesAmount: number;
  totalAmount: number;
  txCount: number;
}

interface PieDatum {
  key: string;
  label: string;
  amount: number;
  color: string;
}

const CATEGORY_CONFIG = {
  data: {
    label: 'Data Bundles',
    color: '#8B5CF6',
    colorLight: '#A78BFA',
    colorDark: '#7C3AED',
    icon: Wifi,
    bgClass: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  airtime: {
    label: 'Airtime Recharge',
    color: '#10B981',
    colorLight: '#34D399',
    colorDark: '#059669',
    icon: Smartphone,
    bgClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  utilities: {
    label: 'Utility Payments',
    color: '#F59E0B',
    colorLight: '#FBBF24',
    colorDark: '#D97706',
    icon: Zap,
    bgClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
};

export const SpendingD3Analytics: React.FC<SpendingD3AnalyticsProps> = ({
  transactions,
}) => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  const [chartView, setChartView] = useState<ChartViewType>('stacked');
  const [hoveredData, setHoveredData] = useState<{
    label: string;
    subLabel?: string;
    total: number;
    breakdown?: { name: string; amount: number; color: string; pct: number }[];
  } | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(360);

  // Measure container dimensions responsively
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Process & Aggregate transactions into month and category buckets
  const { monthlyData, totalStats } = useMemo(() => {
    const monthMap = new Map<string, MonthlySpendData>();

    const monthNames: { [k: string]: string } = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12',
    };

    // Filter to expense transactions only (exclude wallet deposits and withdrawals)
    const expenseTx = transactions.filter(
      (tx) => tx.type !== 'wallet_funding' && tx.type !== 'referral_bonus' && tx.status === 'successful'
    );

    expenseTx.forEach((tx) => {
      // Parse date format "18 Aug 2026"
      const parts = tx.date.split(' ');
      let monthAbbr = 'Aug';
      let year = '2026';
      if (parts.length >= 3) {
        monthAbbr = parts[1];
        year = parts[2];
      } else if (parts.length === 2) {
        monthAbbr = parts[0];
        year = parts[1];
      }

      const monthNum = monthNames[monthAbbr] || '08';
      const monthKey = `${year}-${monthNum}`;
      const monthLabel = monthAbbr;
      const fullLabel = `${monthAbbr} ${year}`;

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          monthKey,
          monthLabel,
          fullLabel,
          dataAmount: 0,
          airtimeAmount: 0,
          utilitiesAmount: 0,
          totalAmount: 0,
          txCount: 0,
        });
      }

      const entry = monthMap.get(monthKey)!;
      entry.txCount += 1;
      entry.totalAmount += tx.amount;

      // Categorize
      if (tx.type === 'budget_data' || tx.type === 'std_data') {
        entry.dataAmount += tx.amount;
      } else if (tx.type === 'airtime') {
        entry.airtimeAmount += tx.amount;
      } else {
        // Electricity, Cable TV, Betting, Exam pins, epins, tickets, etc.
        entry.utilitiesAmount += tx.amount;
      }
    });

    // Ensure sorted chronologically
    const sortedMonths = Array.from(monthMap.values()).sort((a, b) =>
      a.monthKey.localeCompare(b.monthKey)
    );

    // Calculate Grand Totals
    let totalData = 0;
    let totalAirtime = 0;
    let totalUtilities = 0;
    let grandTotal = 0;
    let totalTxCount = 0;

    sortedMonths.forEach((m) => {
      totalData += m.dataAmount;
      totalAirtime += m.airtimeAmount;
      totalUtilities += m.utilitiesAmount;
      grandTotal += m.totalAmount;
      totalTxCount += m.txCount;
    });

    return {
      monthlyData: sortedMonths,
      totalStats: {
        totalData,
        totalAirtime,
        totalUtilities,
        grandTotal,
        totalTxCount,
        dataPct: grandTotal > 0 ? (totalData / grandTotal) * 100 : 0,
        airtimePct: grandTotal > 0 ? (totalAirtime / grandTotal) * 100 : 0,
        utilitiesPct: grandTotal > 0 ? (totalUtilities / grandTotal) * 100 : 0,
        monthlyAvg: sortedMonths.length > 0 ? grandTotal / sortedMonths.length : 0,
      },
    };
  }, [transactions]);

  // Render D3 Visualization
  useEffect(() => {
    if (!svgRef.current || monthlyData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawing

    const width = Math.max(containerWidth, 290);
    const height = 220;
    const margin = { top: 22, right: 14, bottom: 32, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Colors
    const textPrimaryColor = isDark ? '#E2E8F0' : '#1E293B';
    const textMutedColor = isDark ? '#94A3B8' : '#64748B';
    const gridLineColor = isDark ? '#1E293B' : '#E2E8F0';

    // ----------------------------------------------------
    // VIEW 1: STACKED MONTHLY BAR CHART
    // ----------------------------------------------------
    if (chartView === 'stacked') {
      const x0 = d3
        .scaleBand<string>()
        .domain(monthlyData.map((d) => d.monthLabel))
        .range([0, innerWidth])
        .padding(0.35);

      const maxSpendValue = Number(d3.max(monthlyData, (d: MonthlySpendData) => d.totalAmount) || 10000);
      const y = d3
        .scaleLinear()
        .domain([0, maxSpendValue * 1.18])
        .nice()
        .range([innerHeight, 0]);

      // Horizontal Grid Lines
      g.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(y.ticks(4))
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', gridLineColor)
        .attr('stroke-dasharray', '3 3')
        .attr('opacity', isDark ? 0.45 : 0.65);

      // Stack data
      type StackKey = 'dataAmount' | 'airtimeAmount' | 'utilitiesAmount';
      const stackKeys: StackKey[] = ['dataAmount', 'airtimeAmount', 'utilitiesAmount'];
      const stack = d3.stack<MonthlySpendData>().keys(stackKeys);
      const stackedData = stack(monthlyData);

      const colorMap: Record<StackKey, string> = {
        dataAmount: CATEGORY_CONFIG.data.color,
        airtimeAmount: CATEGORY_CONFIG.airtime.color,
        utilitiesAmount: CATEGORY_CONFIG.utilities.color,
      };

      // Render Stacked Bars
      const layer = g
        .selectAll('.layer')
        .data(stackedData)
        .enter()
        .append('g')
        .attr('class', 'layer')
        .attr('fill', (d) => colorMap[d.key as StackKey]);

      layer
        .selectAll('rect')
        .data((d) => d)
        .enter()
        .append('rect')
        .attr('x', (d) => x0(d.data.monthLabel) || 0)
        .attr('width', x0.bandwidth())
        .attr('y', innerHeight)
        .attr('height', 0)
        .attr('rx', 3)
        .attr('opacity', 0.92)
        .attr('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
          d3.select(this).attr('opacity', 1).attr('stroke', '#FFFFFF').attr('stroke-width', 1.5);
          const total = d.data.totalAmount;
          setHoveredData({
            label: d.data.fullLabel,
            total,
            breakdown: [
              {
                name: 'Utilities',
                amount: d.data.utilitiesAmount,
                color: CATEGORY_CONFIG.utilities.color,
                pct: total > 0 ? (d.data.utilitiesAmount / total) * 100 : 0,
              },
              {
                name: 'Airtime',
                amount: d.data.airtimeAmount,
                color: CATEGORY_CONFIG.airtime.color,
                pct: total > 0 ? (d.data.airtimeAmount / total) * 100 : 0,
              },
              {
                name: 'Data',
                amount: d.data.dataAmount,
                color: CATEGORY_CONFIG.data.color,
                pct: total > 0 ? (d.data.dataAmount / total) * 100 : 0,
              },
            ],
          });
        })
        .on('mouseleave', function () {
          d3.select(this).attr('opacity', 0.92).attr('stroke', 'none');
          setHoveredData(null);
        })
        .transition()
        .duration(650)
        .delay((_, i) => i * 70)
        .attr('y', (d) => y(d[1]))
        .attr('height', (d) => Math.max(0, y(d[0]) - y(d[1])));

      // Total label on top of each bar
      g.selectAll('.bar-total-label')
        .data(monthlyData)
        .enter()
        .append('text')
        .attr('class', 'bar-total-label')
        .attr('x', (d: MonthlySpendData) => (x0(d.monthLabel) || 0) + x0.bandwidth() / 2)
        .attr('y', (d: MonthlySpendData) => y(d.totalAmount) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', textPrimaryColor)
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .text((d: MonthlySpendData) => `₦${(d.totalAmount / 1000).toFixed(1)}k`);

      // X Axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x0).tickSize(0).tickPadding(8))
        .call((axis) => axis.select('.domain').attr('stroke', gridLineColor))
        .selectAll('text')
        .attr('fill', textMutedColor)
        .attr('font-size', '11px')
        .attr('font-weight', '600');

      // Y Axis
      g.append('g')
        .call(
          d3
            .axisLeft(y)
            .ticks(4)
            .tickFormat((d) => `₦${(Number(d) / 1000).toFixed(0)}k`)
            .tickSize(0)
            .tickPadding(6)
        )
        .call((axis) => axis.select('.domain').remove())
        .selectAll('text')
        .attr('fill', textMutedColor)
        .attr('font-size', '10px')
        .attr('font-mono', 'true');
    }

    // ----------------------------------------------------
    // VIEW 2: CATEGORY DONUT CHART
    // ----------------------------------------------------
    else if (chartView === 'donut') {
      const radius = Math.min(innerWidth, innerHeight) / 2 + 10;
      const donutGroup = g
        .append('g')
        .attr('transform', `translate(${innerWidth / 2},${innerHeight / 2})`);

      const pieData: PieDatum[] = [
        { key: 'data', label: 'Data Bundles', amount: totalStats.totalData, color: CATEGORY_CONFIG.data.color },
        { key: 'airtime', label: 'Airtime', amount: totalStats.totalAirtime, color: CATEGORY_CONFIG.airtime.color },
        { key: 'utilities', label: 'Utilities', amount: totalStats.totalUtilities, color: CATEGORY_CONFIG.utilities.color },
      ];

      const pie = d3
        .pie<PieDatum>()
        .value((d) => d.amount)
        .sort(null)
        .padAngle(0.04);

      const arc = d3
        .arc<d3.PieArcDatum<PieDatum>>()
        .innerRadius(radius * 0.58)
        .outerRadius(radius * 0.92)
        .cornerRadius(6);

      const arcHover = d3
        .arc<d3.PieArcDatum<PieDatum>>()
        .innerRadius(radius * 0.54)
        .outerRadius(radius * 0.98)
        .cornerRadius(6);

      const arcs = donutGroup
        .selectAll('.arc')
        .data(pie(pieData))
        .enter()
        .append('g')
        .attr('class', 'arc');

      arcs
        .append('path')
        .attr('d', arc)
        .attr('fill', (d) => d.data.color)
        .attr('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('d', arcHover as any);

          setHoveredData({
            label: d.data.label,
            total: d.data.amount,
            subLabel: `${((d.data.amount / totalStats.grandTotal) * 100).toFixed(1)}% of total spend`,
          });
        })
        .on('mouseleave', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('d', arc as any);
          setHoveredData(null);
        });

      // Center Donut Text
      donutGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.3em')
        .attr('fill', textMutedColor)
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .text('TOTAL SPENT');

      donutGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .attr('fill', textPrimaryColor)
        .attr('font-size', '14px')
        .attr('font-weight', '800')
        .text(`₦${totalStats.grandTotal.toLocaleString()}`);
    }

    // ----------------------------------------------------
    // VIEW 3: MONTHLY TREND LINE / AREA CHART
    // ----------------------------------------------------
    else if (chartView === 'trend') {
      const x = d3
        .scalePoint<string>()
        .domain(monthlyData.map((d) => d.monthLabel))
        .range([12, innerWidth - 12]);

      const maxSpendVal = Number(d3.max(monthlyData, (d: MonthlySpendData) => d.totalAmount) || 10000);
      const y = d3
        .scaleLinear()
        .domain([0, maxSpendVal * 1.2])
        .nice()
        .range([innerHeight, 0]);

      // Horizontal Grid Lines
      g.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(y.ticks(4))
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', gridLineColor)
        .attr('stroke-dasharray', '3 3')
        .attr('opacity', isDark ? 0.4 : 0.6);

      // Area gradient
      const defs = svg.append('defs');
      const gradient = defs
        .append('linearGradient')
        .attr('id', 'trend-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', '#10B981').attr('stop-opacity', 0.45);
      gradient.append('stop').attr('offset', '100%').attr('stop-color', '#10B981').attr('stop-opacity', 0.0);

      // Area generator
      const area = d3
        .area<MonthlySpendData>()
        .x((d) => x(d.monthLabel) || 0)
        .y0(innerHeight)
        .y1((d) => y(d.totalAmount))
        .curve(d3.curveMonotoneX);

      // Line generator
      const line = d3
        .line<MonthlySpendData>()
        .x((d) => x(d.monthLabel) || 0)
        .y((d) => y(d.totalAmount))
        .curve(d3.curveMonotoneX);

      // Draw Area
      const areaPath = area(monthlyData);
      if (areaPath) {
        g.append('path')
          .attr('fill', 'url(#trend-gradient)')
          .attr('d', areaPath);
      }

      // Draw Line
      const linePath = line(monthlyData);
      if (linePath) {
        g.append('path')
          .attr('fill', 'none')
          .attr('stroke', '#10B981')
          .attr('stroke-width', 2.5)
          .attr('d', linePath);
      }

      // Circles for Data Points
      g.selectAll('.dot')
        .data(monthlyData)
        .enter()
        .append('circle')
        .attr('cx', (d: MonthlySpendData) => x(d.monthLabel) || 0)
        .attr('cy', (d: MonthlySpendData) => y(d.totalAmount))
        .attr('r', 5)
        .attr('fill', isDark ? '#06181e' : '#FFFFFF')
        .attr('stroke', '#10B981')
        .attr('stroke-width', 2.5)
        .attr('cursor', 'pointer')
        .on('mouseenter', function (event, d: MonthlySpendData) {
          d3.select(this).attr('r', 7).attr('fill', '#10B981');
          setHoveredData({
            label: d.fullLabel,
            total: d.totalAmount,
            subLabel: `${d.txCount} transactions executed`,
            breakdown: [
              { name: 'Utilities', amount: d.utilitiesAmount, color: CATEGORY_CONFIG.utilities.color, pct: (d.utilitiesAmount / d.totalAmount) * 100 },
              { name: 'Airtime', amount: d.airtimeAmount, color: CATEGORY_CONFIG.airtime.color, pct: (d.airtimeAmount / d.totalAmount) * 100 },
              { name: 'Data', amount: d.dataAmount, color: CATEGORY_CONFIG.data.color, pct: (d.dataAmount / d.totalAmount) * 100 },
            ],
          });
        })
        .on('mouseleave', function () {
          d3.select(this).attr('r', 5).attr('fill', isDark ? '#06181e' : '#FFFFFF');
          setHoveredData(null);
        });

      // X Axis
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).tickSize(0).tickPadding(8))
        .call((axis) => axis.select('.domain').attr('stroke', gridLineColor))
        .selectAll('text')
        .attr('fill', textMutedColor)
        .attr('font-size', '11px')
        .attr('font-weight', '600');

      // Y Axis
      g.append('g')
        .call(
          d3
            .axisLeft(y)
            .ticks(4)
            .tickFormat((d) => `₦${(Number(d) / 1000).toFixed(0)}k`)
            .tickSize(0)
            .tickPadding(6)
        )
        .call((axis) => axis.select('.domain').remove())
        .selectAll('text')
        .attr('fill', textMutedColor)
        .attr('font-size', '10px')
        .attr('font-mono', 'true');
    }
  }, [monthlyData, chartView, isDark, containerWidth, totalStats]);

  return (
    <div 
      id="d3-spending-analytics-card"
      ref={containerRef}
      className={`border rounded-2xl p-3.5 space-y-3.5 shadow-sm transition-colors duration-300 ${
        isDark ? 'bg-[#0a232b] border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Monthly Spending Patterns
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                D3.js
              </span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Categorized insights: Data, Airtime & Utilities
            </p>
          </div>
        </div>

        {/* View Switcher Segmented Control */}
        <div className={`flex items-center p-0.5 rounded-xl border ${
          isDark ? 'bg-[#071920] border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            id="d3-view-stacked-btn"
            onClick={() => setChartView('stacked')}
            className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
              chartView === 'stacked'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Monthly Stacked Bar Chart"
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
          <button
            id="d3-view-donut-btn"
            onClick={() => setChartView('donut')}
            className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
              chartView === 'donut'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Category Share Donut Chart"
          >
            <PieIcon className="w-3.5 h-3.5" />
          </button>
          <button
            id="d3-view-trend-btn"
            onClick={() => setChartView('trend')}
            className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
              chartView === 'trend'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Monthly Trend Area Chart"
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Category Quick Metric Cards */}
      <div className="grid grid-cols-3 gap-2">
        {/* Data Card */}
        <div className={`p-2.5 rounded-xl border transition-all ${CATEGORY_CONFIG.data.bgClass}`}>
          <div className="flex items-center justify-between mb-1">
            <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center">
              <Wifi className="w-3 h-3 text-purple-400" />
            </div>
            <span className="text-[10px] font-bold font-mono">
              {totalStats.dataPct.toFixed(0)}%
            </span>
          </div>
          <p className="text-[10px] font-medium opacity-80">Data</p>
          <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ₦{totalStats.totalData.toLocaleString()}
          </p>
        </div>

        {/* Airtime Card */}
        <div className={`p-2.5 rounded-xl border transition-all ${CATEGORY_CONFIG.airtime.bgClass}`}>
          <div className="flex items-center justify-between mb-1">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
              <Smartphone className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold font-mono">
              {totalStats.airtimePct.toFixed(0)}%
            </span>
          </div>
          <p className="text-[10px] font-medium opacity-80">Airtime</p>
          <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ₦{totalStats.totalAirtime.toLocaleString()}
          </p>
        </div>

        {/* Utilities Card */}
        <div className={`p-2.5 rounded-xl border transition-all ${CATEGORY_CONFIG.utilities.bgClass}`}>
          <div className="flex items-center justify-between mb-1">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-[10px] font-bold font-mono">
              {totalStats.utilitiesPct.toFixed(0)}%
            </span>
          </div>
          <p className="text-[10px] font-medium opacity-80">Utilities</p>
          <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ₦{totalStats.totalUtilities.toLocaleString()}
          </p>
        </div>
      </div>

      {/* D3 Chart Canvas Area */}
      <div className={`relative border rounded-xl p-2 transition-colors ${
        isDark ? 'bg-[#071920] border-slate-800/80' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <svg ref={svgRef} className="w-full overflow-visible" />

        {/* Dynamic Tooltip on Hover */}
        {hoveredData && (
          <div className={`absolute top-2 right-2 p-2.5 rounded-xl border shadow-lg text-xs backdrop-blur-md transition-all animate-in fade-in zoom-in-95 pointer-events-none z-10 ${
            isDark ? 'bg-[#0a232b]/95 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
          }`}>
            <p className="font-bold text-[11px]">{hoveredData.label}</p>
            {hoveredData.subLabel && (
              <p className="text-[10px] text-slate-400">{hoveredData.subLabel}</p>
            )}
            <p className="text-xs font-extrabold text-emerald-400 mt-0.5">
              ₦{hoveredData.total.toLocaleString()}
            </p>

            {hoveredData.breakdown && (
              <div className="mt-1.5 space-y-0.5 pt-1 border-t border-slate-700/50 text-[10px]">
                {hoveredData.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1 text-slate-300">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-mono font-semibold">₦{item.amount.toLocaleString()} ({item.pct.toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart Legend & Insights footer */}
      <div className="flex items-center justify-between text-xs pt-0.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Airtime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Utilities</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Avg: ₦{Math.round(totalStats.monthlyAvg).toLocaleString()}/mo</span>
        </div>
      </div>
    </div>
  );
};
