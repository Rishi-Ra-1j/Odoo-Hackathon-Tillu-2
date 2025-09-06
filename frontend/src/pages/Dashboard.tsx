import { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { User, Mail, Edit3, Save, X, Shield, Star, Package, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditForm({
        username: user?.username || '',
        email: user?.email || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Validation
    if (!editForm.username.trim()) {
      toast({
        title: "Validation Error",
        description: "Username cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (!editForm.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    // Update user
    updateUser({
      username: editForm.username.trim(),
      email: editForm.email.trim()
    });

    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  // Mock stats data
  const stats = {
    totalListings: 5,
    totalSales: 12,
    totalEarnings: 248.76,
    avgRating: 4.8
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your profile and track your eco-friendly marketplace activity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-medium">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isEditing ? handleSave : handleEditToggle}
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{user?.username}</h3>
                      <Badge variant="secondary" className="mt-1">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified Seller
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          name="username"
                          value={editForm.username}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-3 bg-muted rounded-lg">
                          {user?.username}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {user?.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <div className="p-3 bg-muted rounded-lg">
                        January 2024
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave} className="flex-1">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleEditToggle}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <span className="text-sm">Active Listings</span>
                    </div>
                    <span className="font-bold">{stats.totalListings}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-success" />
                      <span className="text-sm">Total Sales</span>
                    </div>
                    <span className="font-bold">{stats.totalSales}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-accent" />
                      <span className="text-sm">Rating</span>
                    </div>
                    <span className="font-bold">{stats.avgRating}★</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">${stats.totalEarnings}</p>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                  </div>
                </CardContent>
              </Card>

              {/* Eco Impact */}
              <Card className="border-0 shadow-soft bg-gradient-to-br from-success/5 to-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    🌱 Eco Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Products Sold</span>
                      <span className="font-medium">{stats.totalSales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CO₂ Saved</span>
                      <span className="font-medium text-success">~24 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waste Reduced</span>
                      <span className="font-medium text-success">~8 kg</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-success/10 rounded-lg">
                    <p className="text-xs text-center text-success font-medium">
                      Keep up the great work! Your sustainable products are making a difference.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/sell/new">
                      <Package className="w-4 h-4 mr-2" />
                      List New Product
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/me/listings">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Manage Listings
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/purchases">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Order History
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;