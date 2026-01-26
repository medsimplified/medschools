import Image from "next/image";
import Link from "next/link";

type BlogAuthorProps = {
  author: string;
  image?: string | null;
};

const BlogAuthor = ({ author, image }: BlogAuthorProps) => {
  return (
    <div className="blog__author mt-40 mb-40 d-flex align-items-center">
      {image && (
        <Image
          src={image}
          alt={author}
          width={60}
          height={60}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: 16,
          }}
        />
      )}
      <div>
        <h5 className="mb-1">{author}</h5>
      </div>
    </div>
  );
};

export default BlogAuthor;
