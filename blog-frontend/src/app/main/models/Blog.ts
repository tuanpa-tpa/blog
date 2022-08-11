export class BlogList {
    id: number;
    img: string;
    title: string;
    avatar?: string;
    username?: string;
    blogText: string;
    comment?: number;
    tags: [];
    blogPosted?: string
}

export class BlogDetails {
    img: string;
    title: string;
    avatar?: string;
    username?: string;
    postedAt: string;
    content: string;
    comment?: number;
    tags: [];
    bookmarked?: number;
}

export class Comments {
    avatar: string;
    username: string;
    commentedAt: string;
    commentText: string;
}

export class BlogEdit {
    avatar: string;
    username: string;
    postedAt: string;
    blogTitle: string;
    blogCategories: Array<string>;
    blogText: string;
    featuredImage: string;
}

export class BlogCreate {
    avatar: string;
    username: string;
    postedAt: string;
    blogTitle: string;
    blogCategories: Array<string>;
    blogText: string;
    featuredImage: string;
}

export class Categories {
    category: string;
    icon: string;
}

