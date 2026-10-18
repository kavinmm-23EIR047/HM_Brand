CREATE TABLE "site_content" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "site_content_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "site_content_page_key" ON "site_content"("page");

CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "readingTime" TEXT NOT NULL DEFAULT '5 min read',
    "tag" TEXT NOT NULL,
    "highlight" TEXT,
    "color" TEXT NOT NULL DEFAULT '#9E1830',
    "background" TEXT NOT NULL DEFAULT '#FFF4D6',
    "author" TEXT,
    "body" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
CREATE INDEX "blog_posts_isPublished_displayOrder_idx" ON "blog_posts"("isPublished", "displayOrder");
