import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Bird,
  Boxes,
  ChevronRight,
  CloudSun,
  Cpu,
  Droplets,
  Gauge,
  HeartPulse,
  Leaf,
  Menu,
  Radio,
  ShieldCheck,
  Thermometer,
  TrendingUp,
  Wheat,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type ChartKind = "line" | "bar" | "radar" | "pie";

const navItems = [
  { to: "/", label: "智慧总览", icon: Gauge },
  { to: "/livestock", label: "畜群管理", icon: Bird },
  { to: "/environment", label: "环境监测", icon: CloudSun },
  { to: "/feeding", label: "精准饲喂", icon: Wheat },
  { to: "/health", label: "健康防疫", icon: HeartPulse },
  { to: "/operations", label: "经营分析", icon: TrendingUp },
] as const;

const palette = ["#54f1c3", "#25b9ff", "#f7cf5f", "#ff6f91", "#8a82ff"];

const chartData: Record<ChartKind, { title: string; option: Record<string, unknown> }> = {
  line: {
    title: "近 24 小时环境趋势",
    option: {
      tooltip: { trigger: "axis" },
      legend: { top: 10, right: 14, textStyle: { color: "#9fb9c5" } },
      grid: { left: 42, right: 24, top: 56, bottom: 30 },
      xAxis: { type: "category", data: ["00", "04", "08", "12", "16", "20", "24"], axisLine: { lineStyle: { color: "#325260" } }, axisLabel: { color: "#7895a2" } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(105,165,181,.13)" } }, axisLabel: { color: "#7895a2" } },
      series: [
        { name: "温度 °C", type: "line", smooth: true, symbol: "circle", data: [21, 20, 23, 27, 26, 23, 22], lineStyle: { width: 3, color: palette[0] }, itemStyle: { color: palette[0] }, areaStyle: { color: "rgba(84,241,195,.12)" } },
        { name: "湿度 %", type: "line", smooth: true, data: [67, 69, 65, 58, 61, 64, 66], lineStyle: { width: 2, color: palette[1] }, itemStyle: { color: palette[1] } },
      ],
    },
  },
  bar: {
    title: "各养殖区饲料转化率",
    option: {
      tooltip: { trigger: "axis" },
      grid: { left: 42, right: 18, top: 28, bottom: 34 },
      xAxis: { type: "category", data: ["A1", "A2", "B1", "B2", "C1", "C2"], axisLine: { lineStyle: { color: "#325260" } }, axisLabel: { color: "#7895a2" } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(105,165,181,.13)" } }, axisLabel: { color: "#7895a2" } },
      series: [{ type: "bar", barWidth: 18, data: [82, 91, 78, 88, 95, 86], itemStyle: { borderRadius: [4, 4, 0, 0], color: { type: "linear", x: 0, y: 1, x2: 0, y2: 0, colorStops: [{ offset: 0, color: "#177d92" }, { offset: 1, color: palette[0] }] } } }],
    },
  },
  radar: {
    title: "畜群健康指数",
    option: {
      radar: { radius: "62%", indicator: [{ name: "活跃度", max: 100 }, { name: "采食", max: 100 }, { name: "免疫", max: 100 }, { name: "增重", max: 100 }, { name: "睡眠", max: 100 }], axisName: { color: "#9fb9c5" }, splitArea: { areaStyle: { color: ["rgba(84,241,195,.02)", "rgba(37,185,255,.05)"] } }, splitLine: { lineStyle: { color: "rgba(96,173,184,.24)" } }, axisLine: { lineStyle: { color: "rgba(96,173,184,.22)" } } },
      series: [{ type: "radar", data: [{ value: [92, 86, 97, 83, 89], name: "本周" }], lineStyle: { color: palette[0], width: 2 }, itemStyle: { color: palette[0] }, areaStyle: { color: "rgba(84,241,195,.26)" } }],
    },
  },
  pie: {
    title: "畜群结构分布",
    option: {
      tooltip: { trigger: "item" },
      legend: { bottom: 4, textStyle: { color: "#9fb9c5" } },
      series: [{ type: "pie", radius: ["48%", "72%"], center: ["50%", "43%"], padAngle: 3, itemStyle: { borderRadius: 5 }, label: { show: false }, data: [{ value: 42, name: "育成期" }, { value: 28, name: "繁育期" }, { value: 19, name: "哺乳期" }, { value: 11, name: "观察期" }], color: palette }],
    },
  },
};

function Chart({ kind, height = 250 }: { kind: ChartKind; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: { setOption: (option: object) => void; resize: () => void; dispose: () => void } | undefined;
    let active = true;
    void import("echarts").then((echarts) => {
      if (!active || !ref.current) return;
      chart = echarts.init(ref.current);
      chart.setOption({ backgroundColor: "transparent", textStyle: { fontFamily: "Manrope" }, ...chartData[kind].option });
    });
    const resize = () => chart?.resize();
    window.addEventListener("resize", resize);
    return () => { active = false; window.removeEventListener("resize", resize); chart?.dispose(); };
  }, [kind]);
  return <div ref={ref} style={{ height }} className="w-full" aria-label={chartData[kind].title} />;
}

function GlassPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`glass-panel ${className}`}>{children}</section>;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div><button className="icon-action" title="查看详情"><ChevronRight size={17} /></button></div>;
}

const stats = [
  { label: "存栏总量", value: "12,680", unit: "头", delta: "+3.2%", icon: Bird, tone: "mint" },
  { label: "今日采食", value: "28.6", unit: "吨", delta: "+1.8%", icon: Wheat, tone: "blue" },
  { label: "健康指数", value: "96.8", unit: "%", delta: "+0.6%", icon: HeartPulse, tone: "rose" },
  { label: "设备在线", value: "248", unit: "/ 252", delta: "98.4%", icon: Cpu, tone: "amber" },
];

function StatCards({ variant = false }: { variant?: boolean }) {
  return <div className={`grid gap-4 ${variant ? "grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-4"}`}>{stats.map((item, i) => <GlassPanel key={item.label} className={`stat-card tone-${item.tone} ${variant && i === 0 ? "sm:col-span-2 xl:col-span-1" : ""}`}><div className="flex items-start justify-between"><span className="stat-icon"><item.icon size={19} /></span><span className="trend-up">{item.delta}</span></div><div className="mt-5"><p className="text-xs text-muted-foreground">{item.label}</p><p className="mt-1 font-display text-3xl font-semibold text-foreground">{item.value} <span className="text-xs font-normal text-muted-foreground">{item.unit}</span></p></div></GlassPanel>)}</div>;
}

const zones = [
  ["A1 育成舍", "2,460", "24.2°C", "正常"],
  ["A2 育成舍", "2,180", "24.8°C", "正常"],
  ["B1 繁育舍", "1,920", "25.1°C", "关注"],
  ["B2 保育舍", "2,850", "23.9°C", "正常"],
  ["C1 隔离舍", "186", "24.5°C", "正常"],
];

function DataTable({ health = false }: { health?: boolean }) {
  return <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>{health ? "耳标编号" : "养殖单元"}</th><th>{health ? "异常类型" : "存栏"}</th><th>{health ? "监测时间" : "实时温度"}</th><th>状态</th></tr></thead><tbody>{zones.map((row, i) => <tr key={row[0]}><td><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary" />{health ? `CN-23${81 + i}-0${i + 1}` : row[0]}</td><td>{health ? ["采食下降", "体温偏高", "活动减少", "反刍异常", "例行复检"][i] : row[1]}</td><td>{health ? `${10 + i}:2${i}` : row[2]}</td><td><span className={`status ${i === 2 ? "status-warn" : "status-ok"}`}>{i === 2 ? "待处理" : "正常"}</span></td></tr>)}</tbody></table></div>;
}

function TopNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  return <header className="top-nav"><Link to="/" className="brand"><span className="brand-mark"><Leaf size={21} /></span><span><strong>牧云智养</strong><small>SMART FARM OS</small></span></Link><nav className="desktop-nav">{navItems.map((item) => <Link key={item.to} to={item.to} className={`nav-link ${pathname === item.to ? "active" : ""}`}><item.icon size={16} /><span>{item.label}</span></Link>)}</nav><div className="nav-tools"><button className="icon-action notification" title="预警通知"><Bell size={18} /><i /></button><div className="live-pill"><Radio size={13} />实时在线</div><button className="icon-action mobile-menu" title="打开菜单" onClick={() => setOpen(!open)}>{open ? <X size={19} /> : <Menu size={19} />}</button></div>{open && <nav className="mobile-nav">{navItems.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className={`nav-link ${pathname === item.to ? "active" : ""}`}><item.icon size={17} />{item.label}</Link>)}</nav>}</header>;
}

const pageMeta = {
  overview: ["智慧养殖数据中枢", "全场生产态势与智能设备运行概览"],
  livestock: ["畜群全生命周期管理", "精准追踪存栏结构、繁育与生长状态"],
  environment: ["环境感知与智能环控", "多维传感网络全天候守护养殖环境"],
  feeding: ["AI 精准饲喂中心", "按日龄、体重与生产阶段动态优化配方"],
  health: ["健康防疫预警中心", "个体级体征监测与风险闭环处置"],
  operations: ["经营决策驾驶舱", "从成本、产量到收益的全链路洞察"],
} as const;

export function FarmDashboard({ page }: { page: keyof typeof pageMeta }) {
  const [title, subtitle] = pageMeta[page];
  return <div className="farm-shell"><div className="ambient-grid" /><TopNav /><main className="dashboard-main"><div className="page-heading"><div><div className="eyebrow"><span /> DIGITAL BREEDING CENTER</div><h1>{title}</h1><p>{subtitle}</p></div><div className="weather"><CloudSun size={28} /><div><strong>22°C</strong><span>晴 · 东南风 2级</span></div></div></div>{page === "overview" && <Overview />}{page === "livestock" && <Livestock />}{page === "environment" && <Environment />}{page === "feeding" && <Feeding />}{page === "health" && <Health />}{page === "operations" && <Operations />}</main></div>;
}

function Overview() { return <div className="space-y-4"><StatCards /><div className="grid gap-4 xl:grid-cols-[1.45fr_.85fr]"><GlassPanel><SectionTitle title="全场环境趋势" subtitle="传感器每 5 分钟同步一次" /><Chart kind="line" height={278} /></GlassPanel><GlassPanel><SectionTitle title="健康能力雷达" subtitle="较上周综合提升 2.4%" /><Chart kind="radar" height={278} /></GlassPanel></div><div className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]"><GlassPanel><SectionTitle title="畜群结构" /><Chart kind="pie" height={240} /></GlassPanel><GlassPanel><SectionTitle title="养殖单元实时状态" subtitle="共 18 个单元，17 个运行正常" /><DataTable /></GlassPanel></div></div>; }

function Livestock() { return <div className="space-y-4"><div className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]"><GlassPanel className="livestock-hero"><div><span className="data-label">实时在群</span><strong>12,680</strong><p>今日新增入栏 126 头 · 转群 84 头</p></div><div className="ring-stat"><span>成活率</span><b>98.7%</b></div></GlassPanel><GlassPanel><SectionTitle title="批次进度" /><div className="progress-list">{[["春育 041",83],["繁育 026",68],["保育 018",46]].map(([n,v])=><div key={n}><span>{n}</span><b>{v}%</b><i><em style={{width:`${v}%`}} /></i></div>)}</div></GlassPanel></div><div className="grid gap-4 lg:grid-cols-2"><GlassPanel><SectionTitle title="日增重趋势" subtitle="单位：克 / 天" /><Chart kind="line" height={260} /></GlassPanel><GlassPanel><SectionTitle title="区域存栏对比" /><Chart kind="bar" height={260} /></GlassPanel></div><GlassPanel><SectionTitle title="个体与批次档案" subtitle="耳标、日龄与健康状态同步更新" /><DataTable /></GlassPanel></div>; }

function Environment() { const sensors=[[Thermometer,"舍内温度","24.3°C","舒适"],[Droplets,"空气湿度","64%","适宜"],[Zap,"氨气浓度","8 ppm","优良"],[Activity,"空气质量","92","优良"]] as const; return <div className="space-y-4"><div className="sensor-grid">{sensors.map(([Icon,label,value,state],i)=><GlassPanel key={label} className="sensor-card"><div className={`sensor-orbit orbit-${i}`}><Icon size={26}/></div><div><span>{label}</span><strong>{value}</strong><small>{state}</small></div></GlassPanel>)}</div><div className="grid gap-4 xl:grid-cols-[1.5fr_.5fr]"><GlassPanel><SectionTitle title="环境指标联动曲线" subtitle="温湿度与通风系统实时关联" /><Chart kind="line" height={330}/></GlassPanel><GlassPanel><SectionTitle title="设备联动状态" /><div className="device-stack">{["负压风机组","湿帘循环泵","智能卷帘","除臭喷淋"].map((x,i)=><div key={x}><span><i className={i===3?"warn-dot":"ok-dot"}/>{x}</span><b>{i===3?"待机":"运行"}</b></div>)}</div><div className="environment-score"><ShieldCheck/><span>环境综合评分</span><strong>94</strong></div></GlassPanel></div><GlassPanel><SectionTitle title="各区域环境达标率" /><Chart kind="bar" height={235}/></GlassPanel></div>; }

function Feeding() { return <div className="space-y-4"><StatCards variant/><div className="feeding-layout"><GlassPanel className="formula-panel"><SectionTitle title="今日智能配方" subtitle="AI 根据生长阶段动态调整" /><div className="formula-core"><div><span>配方精准度</span><strong>97.6%</strong></div></div><div className="formula-list">{[["玉米",42],["豆粕",24],["麦麸",18],["预混料",16]].map(([n,v],i)=><div key={n}><span><i style={{background:palette[i]}}/>{n}</span><b>{v}%</b></div>)}</div></GlassPanel><GlassPanel><SectionTitle title="七日饲喂计划与实际" /><Chart kind="bar" height={330}/></GlassPanel></div><GlassPanel><SectionTitle title="料塔与配送任务" /><div className="silo-row">{[72,86,49,93,64].map((v,i)=><div className="silo" key={i}><div><i style={{height:`${v}%`}}/><span>{v}%</span></div><b>{String.fromCharCode(65+i)}-{i+1} 料塔</b></div>)}</div></GlassPanel></div>; }

function Health() { return <div className="space-y-4"><div className="health-banner"><div><span className="pulse-icon"><HeartPulse/></span><div><strong>整体健康风险较低</strong><p>AI 体征模型已覆盖 98.4% 在群个体</p></div></div><div className="risk-score"><small>安全指数</small><b>96.8</b></div></div><div className="grid gap-4 xl:grid-cols-[.75fr_1.25fr]"><GlassPanel><SectionTitle title="核心健康维度" /><Chart kind="radar" height={310}/></GlassPanel><GlassPanel><SectionTitle title="今日异常事件" subtitle="4 条待处理 · 12 条已闭环" /><DataTable health /></GlassPanel></div><div className="grid gap-4 md:grid-cols-3">{[["免疫计划","牛口蹄疫加强免疫","明日 08:30"],["消毒任务","B 区通道雾化消毒","今日 16:00"],["兽医巡检","重点观察栏复检","进行中"]].map((x,i)=><GlassPanel key={x[0]} className="task-card"><div><span className={`task-num n-${i}`}>0{i+1}</span><small>{x[0]}</small></div><strong>{x[1]}</strong><p>{x[2]}</p></GlassPanel>)}</div></div>; }

function Operations() { return <div className="space-y-4"><div className="operations-kpis">{[["本月产值","¥ 286.4万","+12.8%"],["综合成本","¥ 178.2万","-3.6%"],["预计利润","¥ 108.2万","+21.4%"]].map((x,i)=><GlassPanel key={x[0]} className={`op-kpi op-${i}`}><span>{x[0]}</span><strong>{x[1]}</strong><b>{x[2]} 同比</b></GlassPanel>)}</div><div className="grid gap-4 xl:grid-cols-[1.3fr_.7fr]"><GlassPanel><SectionTitle title="产值与成本走势" subtitle="2026 年度经营数据" /><Chart kind="line" height={330}/></GlassPanel><GlassPanel><SectionTitle title="成本构成" /><Chart kind="pie" height={330}/></GlassPanel></div><div className="grid gap-4 lg:grid-cols-2"><GlassPanel><SectionTitle title="区域生产效率" /><Chart kind="bar" height={250}/></GlassPanel><GlassPanel><SectionTitle title="关键经营指标" /><div className="metric-list">{[["料肉比","2.41","行业优秀"],["单位饲养成本","¥ 14.06/kg","环比下降"],["设备能耗","18.6 kWh/头","节能 8.2%"],["人工效率","426 头/人","提升 11.3%"]].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><b>{x[2]}</b></div>)}</div></GlassPanel></div></div>; }