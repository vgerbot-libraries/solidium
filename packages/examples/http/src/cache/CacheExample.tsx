import { Cache, Endpoint, Get, PathVariable, R, restful } from '@vgerbot/http';
import { Auto, Signal, useService } from '@vgerbot/solidium';
import { Inject } from '@vgerbot/ioc';
import { createSignal } from 'solid-js';

// Define an API endpoint with the CacheInterceptor
@Endpoint({
    baseURL: 'https://jsonplaceholder.typicode.com'
})
class JsonPlaceholderAPI {
    @Get('/posts/:id')
    @Cache({})
    getPost(@PathVariable('id') id: R<number>) {
        return restful<Post>(id);
    }

    @Get('/posts')
    getPosts() {
        return restful<Post[]>();
    }
}

// Post interface matching the API response
interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

// Service to manage API calls
@Auto
class PostService {
    @Signal()
    selectedPostId: number = 1;
    @Inject()
    private api!: JsonPlaceholderAPI;

    getPost(id: R<number>) {
        return this.api.getPost(id);
    }

    getPosts() {
        return this.api.getPosts();
    }
}

// Component to display a post
export function PostViewer() {
    const service = useService(PostService);
    const [postId, setPostId] = createSignal(1);

    // Get the post data
    const postResource = service.getPost(postId);

    // Get all posts
    const postsResource = service.getPosts();

    // Handle post selection
    const selectPost = (id: number) => {
        setPostId(id);
    };

    return (
        <div>
            <h1>Cache Interceptor Example</h1>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: '1' }}>
                    <h2>Posts List</h2>
                    <p>
                        <small>
                            (Cached for 30 seconds - notice how quickly it loads
                            after the first request)
                        </small>
                    </p>

                    {postsResource.loading && <p>Loading posts...</p>}

                    {postsResource.data && (
                        <ul>
                            {postsResource.data.slice(0, 10).map(post => (
                                <li>
                                    <a
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault();
                                            selectPost(post.id);
                                        }}
                                    >
                                        {post.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        onClick={() => postsResource.reload(true)}
                        disabled={postsResource.loading}
                    >
                        Reload Posts (Force Refresh)
                    </button>
                </div>

                <div style={{ flex: '1' }}>
                    <h2>Selected Post Details</h2>
                    <p>
                        <small>
                            Post ID: {postId()} (Cached for 30 seconds)
                        </small>
                    </p>

                    {postResource.loading && <p>Loading post...</p>}

                    {postResource.data && (
                        <div>
                            <h3>{postResource.data?.title}</h3>
                            <p>{postResource.data?.body}</p>
                        </div>
                    )}

                    <div style={{ 'margin-top': '20px' }}>
                        <button
                            onClick={() =>
                                setPostId(prev => Math.max(1, prev - 1))
                            }
                            disabled={postId() <= 1}
                        >
                            Previous Post
                        </button>
                        <button
                            onClick={() => setPostId(prev => prev + 1)}
                            style={{ 'margin-left': '10px' }}
                        >
                            Next Post
                        </button>
                        <button
                            onClick={() => postResource.reload(true)}
                            style={{ 'margin-left': '10px' }}
                            disabled={postResource.loading}
                        >
                            Reload (Force Refresh)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
