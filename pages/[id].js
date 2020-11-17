import { GraphQLClient, gql } from 'graphql-request';

const graphqlEndpoint = 'https://api.komachine.com/graphql';

const graphQLClient = new GraphQLClient(graphqlEndpoint, {
  credentials: 'include',
  mode: 'cors',
});
const fetcher = (query, variables) => {
  return graphQLClient.request(query, variables);
};

const POST = gql`
  query post($id: Int!) {
    post(id: $id) {
      id
      subject
      type
      content
      writer {
        id
        firstName
        expertProfile {
          id
          image
        }
      }
      categories {
        id
        name
      }
      createdAt
      comments {
        id
        content
        writer {
          id
          firstName
          expertProfile {
            id
            image
          }
        }
        likes {
          id
          user {
            id
          }
        }
      }
      likes {
        id
        user {
          id
        }
      }
    }
  }
`;

export default function Company({ post }) {
  return (
    <div>
      <span>{post.subject}</span>
    </div>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  console.log(params);
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const { post } = await fetcher(POST, { id: params.id });

  // Pass post data to the page via props
  return {
    props: { post },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
}
