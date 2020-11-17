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
      <div>{post.id}</div>
      <div>{post.subject}</div>
      <div>{post.type}</div>
    </div>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  try {
    const { post } = await fetcher(POST, { id: params.id });
    return {
      props: { post },
      revalidate: 10,
    };
  } catch (error) {
    return {
      props: {},
      notFound: true,
    };
  }
}
