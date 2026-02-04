import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

interface Order {
  id: string;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
}

interface AnalyticsChartsProps {
  orders: Order[];
}

const COLORS = ['#1B4332', '#D4AF37', '#2D6A4F', '#40916C', '#52B788', '#74C69D'];

export const AnalyticsCharts = ({ orders }: AnalyticsChartsProps) => {
  // Sales by day (last 7 days)
  const salesByDay = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayOrders = orders.filter(o => o.created_at.split('T')[0] === date);
      const sales = dayOrders.reduce((sum, o) => sum + Number(o.total_price), 0);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return { day: dayName, sales, orders: dayOrders.length };
    });
  }, [orders]);

  // Orders by status
  const ordersByStatus = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [orders]);

  // Payment methods breakdown
  const paymentMethods = useMemo(() => {
    const methodCounts: Record<string, number> = {};
    orders.forEach(o => {
      const method = o.payment_method?.toUpperCase() || 'Unknown';
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });
    return Object.entries(methodCounts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Monthly revenue trend (last 6 months)
  const monthlyRevenue = useMemo(() => {
    const months: Record<string, number> = {};
    
    orders.forEach(o => {
      if (o.status === 'delivered') {
        const month = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        months[month] = (months[month] || 0) + Number(o.total_price);
      }
    });

    return Object.entries(months)
      .slice(-6)
      .map(([month, revenue]) => ({ month, revenue }));
  }, [orders]);

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      {/* Sales Trend */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-display">Sales Trend (Last 7 Days)</CardTitle>
          <CardDescription>Daily sales and order count</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => [
                  name === 'sales' ? `৳${value.toLocaleString()}` : value,
                  name === 'sales' ? 'Revenue' : 'Orders'
                ]}
              />
              <Legend />
              <Bar dataKey="sales" fill="#1B4332" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" fill="#D4AF37" name="Orders" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Order Status</CardTitle>
          <CardDescription>Current distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {ordersByStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Payment Methods</CardTitle>
          <CardDescription>Order payment breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {paymentMethods.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      {monthlyRevenue.length > 0 && (
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-display">Monthly Revenue</CardTitle>
            <CardDescription>Revenue from delivered orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1B4332" 
                  strokeWidth={3}
                  dot={{ fill: '#D4AF37', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#D4AF37' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
