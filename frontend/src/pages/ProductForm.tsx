import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Upload, DollarSign, Package } from 'lucide-react';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts';
import { mockCategories, mockProducts } from '../utils/mockData';
import { toast } from '../hooks/use-toast';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  // Load product data for editing
  useEffect(() => {
    if (isEditing) {
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          image: product.image || ''
        });
      }
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Product title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Product description is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category.",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || null
    };

    try {
      if (isEditing && id) {
        await updateProductMutation.mutateAsync({ productId: id as string, productData });
        navigate('/me/listings');
      } else {
        await createProductMutation.mutateAsync(productData);
        navigate('/me/listings');
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Product' : 'List New Product'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update your product details' : 'Share your eco-friendly product with the community'}
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter product title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-10"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your product, its eco-friendly features, and benefits..."
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Product Image URL</Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="pl-10"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Paste a URL to an image of your product. Leave empty for default placeholder.
                </p>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="border rounded-lg p-4">
                  <Label className="text-sm font-medium">Image Preview</Label>
                  <div className="mt-2 aspect-video max-w-xs overflow-hidden rounded-lg bg-muted">
                  <img 
                    src={formData.image} 
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const nextSibling = target.nextSibling as HTMLElement;
                      if (nextSibling) nextSibling.style.display = 'flex';
                    }}
                  />
                    <div className="w-full h-full hidden items-center justify-center text-sm text-muted-foreground">
                      Invalid image URL
                    </div>
                  </div>
                </div>
              )}

              {/* Eco-Friendly Tips */}
              <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                <h4 className="font-medium text-success mb-2">💚 Eco-Friendly Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Highlight sustainable materials or manufacturing processes</li>
                  <li>• Mention certifications (organic, fair trade, recyclable)</li>
                  <li>• Describe environmental benefits of your product</li>
                  <li>• Include care instructions for longevity</li>
                </ul>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading 
                    ? (isEditing ? 'Updating...' : 'Creating...') 
                    : (isEditing ? 'Update Product' : 'List Product')
                  }
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProductForm;