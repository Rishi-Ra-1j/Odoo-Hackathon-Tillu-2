import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, ShoppingCart, Heart, User, Shield, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAddToCart } from '../hooks/useCart';
import { mockProducts } from '../utils/mockData';
import { toast } from '../hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const addToCartMutation = useAddToCart();

  // Find product by ID (in real app, this would be an API call)
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isOwner = user?.id === product.seller?.id;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCartMutation.mutate({ productId: product.id });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCartMutation.mutate({ productId: product.id });
    navigate('/cart');
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-xl">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-secondary flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-4xl font-bold text-primary mb-6">
                ${product.price}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Sold by {product.seller.username}</p>
                    <p className="text-sm text-muted-foreground">Verified eco-seller</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <Shield className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-sm">Eco-Certified</p>
                  <p className="text-xs text-muted-foreground">Sustainable materials</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $25</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                <Heart className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-sm">30-Day Returns</p>
                  <p className="text-xs text-muted-foreground">Hassle-free returns</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isAuthenticated && !isOwner ? (
              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={addToCartMutation.isPending}
                >
                  Buy Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="ghost" size="lg">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            ) : isOwner ? (
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-muted-foreground">This is your product listing</p>
                <Button variant="outline" className="mt-2" onClick={() => navigate('/me/listings')}>
                  Manage Listings
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={() => navigate('/login')}>
                  Sign in to Purchase
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover-lift overflow-hidden border-0 shadow-soft">
                  <div className="aspect-square overflow-hidden bg-secondary">
                    {relatedProduct.image ? (
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedProduct.title}</h3>
                    <p className="text-lg font-bold text-primary">${relatedProduct.price}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;