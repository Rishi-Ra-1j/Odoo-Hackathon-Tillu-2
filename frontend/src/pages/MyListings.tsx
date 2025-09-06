import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Plus, Package } from 'lucide-react';
import { useMyProducts } from '../hooks/useProducts';
import { mockProducts } from '../utils/mockData';

const MyListings = () => {
  const navigate = useNavigate();
  
  // Using mock data for demo - in real app this would use: const { data: products, isLoading } = useMyProducts();
  // Filter mock products to show only user's products (for demo purposes)
  const userProducts = mockProducts.slice(0, 3); // Show first 3 as user's products

  const handleEdit = (product) => {
    navigate(`/sell/${product.id}/edit`);
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Listings</h1>
            <p className="text-muted-foreground">
              Manage your eco-friendly product listings
            </p>
          </div>
          <Button onClick={() => navigate('/sell/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-soft border-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userProducts.length}</p>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-soft border-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Total Sales</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-soft border-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">$248.76</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {userProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showActions={true}
                onEdit={handleEdit}
                onDelete={() => {}}
              />
            ))}
            </div>

            {/* Pagination or Load More could go here */}
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Showing {userProducts.length} of {userProducts.length} listings
              </p>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">No listings yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start selling your eco-friendly products to the community. List your first item today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/sell/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Listing
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Browse Marketplace
              </Button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-16 bg-gradient-to-r from-success/5 to-primary/5 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">💡 Selling Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="font-semibold mb-2">Great Photos</h3>
              <p className="text-sm text-muted-foreground">
                Use high-quality images that showcase your product's eco-friendly features
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-semibold mb-2">Highlight Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                Emphasize eco-friendly materials, certifications, and environmental benefits
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold mb-2">Detailed Descriptions</h3>
              <p className="text-sm text-muted-foreground">
                Provide comprehensive details about materials, use cases, and care instructions
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyListings;