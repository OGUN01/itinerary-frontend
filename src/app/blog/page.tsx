export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Hidden Gems in Europe",
      excerpt: "Discover the lesser-known but equally beautiful destinations across Europe that should be on your travel bucket list.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Destinations",
      readTime: "5 min read",
      image: "https://source.unsplash.com/random/800x400?europe,travel"
    },
    {
      id: 2,
      title: "Budget Travel Tips for 2024",
      excerpt: "Expert tips and tricks to make the most of your travel budget in the new year.",
      author: "Mike Chen",
      date: "2024-01-12",
      category: "Travel Tips",
      readTime: "4 min read",
      image: "https://source.unsplash.com/random/800x400?budget,travel"
    },
    {
      id: 3,
      title: "Sustainable Travel: A Complete Guide",
      excerpt: "Learn how to minimize your environmental impact while exploring the world.",
      author: "Emma Wilson",
      date: "2024-01-10",
      category: "Sustainable Travel",
      readTime: "6 min read",
      image: "https://source.unsplash.com/random/800x400?sustainable,nature"
    },
    {
      id: 4,
      title: "Digital Nomad Essentials",
      excerpt: "Everything you need to know about working while traveling the world.",
      author: "David Lee",
      date: "2024-01-08",
      category: "Digital Nomad",
      readTime: "7 min read",
      image: "https://source.unsplash.com/random/800x400?laptop,coffee"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Travel Blog</h1>
      
      {/* Featured Post */}
      <div className="card lg:card-side bg-base-100 shadow-xl mb-8">
        <figure className="lg:w-1/2">
          <img 
            src={blogPosts[0].image}
            alt={blogPosts[0].title}
            className="h-full w-full object-cover"
          />
        </figure>
        <div className="card-body lg:w-1/2">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>{blogPosts[0].category}</span>
            <span>•</span>
            <span>{blogPosts[0].readTime}</span>
          </div>
          <h2 className="card-title text-2xl">{blogPosts[0].title}</h2>
          <p>{blogPosts[0].excerpt}</p>
          <div className="flex items-center gap-4 mt-4">
            <div>
              <p className="font-medium">{blogPosts[0].author}</p>
              <p className="text-sm text-gray-600">{new Date(blogPosts[0].date).toLocaleDateString()}</p>
            </div>
            <button className="btn btn-primary ml-auto">Read More</button>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.slice(1).map((post) => (
          <div key={post.id} className="card bg-base-100 shadow-xl">
            <figure>
              <img 
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="card-title">{post.title}</h2>
              <p className="line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-gray-600">{new Date(post.date).toLocaleDateString()}</p>
                </div>
                <button className="btn btn-sm btn-primary ml-auto">Read More</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="card bg-base-200 mt-12 p-8">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
          <p className="mb-6">Get the latest travel tips and insights delivered straight to your inbox.</p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="input input-bordered flex-grow" 
            />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
} 