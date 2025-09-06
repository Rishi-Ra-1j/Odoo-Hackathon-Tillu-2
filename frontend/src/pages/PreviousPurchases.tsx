import { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ChevronDown, ChevronUp, Package, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { mockOrders } from '../utils/mockData';

const PreviousPurchases = () => {
  // Using mock data for demo - in real app this would use: const { data: orders, isLoading } = useOrders();
  const orders = mockOrders;
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-success text-success-foreground';
      case 'shipped':
        return 'bg-primary text-primary-foreground';
      case 'processing':
        return 'bg-accent text-accent-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Order History</h1>
            <p className="text-muted-foreground">
              Track your eco-friendly purchases and their positive impact
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalItems}</p>
                    <p className="text-sm text-muted-foreground">Items Purchased</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                
                return (
                  <Card key={order.id} className="border-0 shadow-soft">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Calendar className="w-4 h-4" />
                              Order #{order.id}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleOrderExpansion(order.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />
                        <div className="space-y-4">
                          <h4 className="font-semibold">Order Items</h4>
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary">
                                {item.product.image ? (
                                  <img 
                                    src={item.product.image} 
                                    alt={item.product.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <h5 className="font-medium mb-1">{item.product.title}</h5>
                                <Badge variant="secondary" className="text-xs">
                                  {item.product.category}
                                </Badge>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-medium">${item.price.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          
                          {/* Order Actions */}
                          <div className="flex gap-2 pt-4">
                            <Button variant="outline" size="sm">
                              Track Package
                            </Button>
                            <Button variant="outline" size="sm">
                              Leave Review
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm">
                                Buy Again
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">No orders yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start shopping for eco-friendly products and build a sustainable lifestyle.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Start Shopping
              </Button>
            </div>
          )}

          {/* Eco Impact Summary */}
          {orders.length > 0 && (
            <Card className="mt-8 border-0 shadow-soft bg-gradient-to-r from-success/5 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌱 Your Eco Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-success">~52 kg</p>
                    <p className="text-sm text-muted-foreground">CO₂ Reduced</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">~18 kg</p>
                    <p className="text-sm text-muted-foreground">Waste Prevented</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{totalItems}</p>
                    <p className="text-sm text-muted-foreground">Sustainable Products</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-success/10 rounded-lg">
                  <p className="text-center text-sm text-success font-medium">
                    🎉 Amazing! Your sustainable choices are making a real difference for our planet.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PreviousPurchases;