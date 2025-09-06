import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAddToCart } from '../hooks/useCart';
import { useDeleteProduct } from '../hooks/useProducts';

const ProductCard = ({ product, showActions = false, onEdit, onDelete }: {
  product: any;
  showActions?: boolean;
  onEdit?: (product: any) => void;
  onDelete?: (product: any) => void;
}) => {
  const { user, isAuthenticated } = useAuth();
  const addToCartMutation = useAddToCart();
  const deleteProductMutation = useDeleteProduct();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate({ productId: product.id });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(product.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(product);
  };

  const isOwner = user?.id === product.seller?.id;

  return (
    <Card className="group hover-lift overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-secondary">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No image</p>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category Badge */}
          <Badge variant="secondary" className="mb-2 text-xs">
            {product.category}
          </Badge>

          {/* Product Title */}
          <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Product Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${product.price}
            </span>
            {product.seller && (
              <span className="text-xs text-muted-foreground">
                by {product.seller.username}
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {showActions && isOwner ? (
          // Owner actions
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={handleDelete}
              disabled={deleteProductMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </>
        ) : (
          // Buyer actions
          isAuthenticated && !isOwner && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;