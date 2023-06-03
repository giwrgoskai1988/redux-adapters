import { rest, setupWorker } from "msw";

// Add an extra delay to all endpoints, so loading spinners show up.
const ARTIFICIAL_DELAY_MS = 2000;

export const handlers = [
  rest.get("/fakeApi/posts", function (req, res, ctx) {
    const posts = db.post.getAll().map(serializePost);
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(posts));
  }),
  rest.post("/fakeApi/posts", function (req, res, ctx) {
    const data = req.body;

    if (data.content === "error") {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(500),
        ctx.json("Server error saving this post!")
      );
    }

    data.date = new Date().toISOString();

    const user = db.user.findFirst({ where: { id: { equals: data.user } } });
    data.user = user;
    data.reactions = db.reaction.create();

    const post = db.post.create(data);
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(serializePost(post)));
  }),
  rest.get("/fakeApi/posts/:postId", function (req, res, ctx) {
    const post = db.post.findFirst({
      where: { id: { equals: req.params.postId } },
    });
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(serializePost(post)));
  }),
  rest.patch("/fakeApi/posts/:postId", (req, res, ctx) => {
    const { id, ...data } = req.body;
    const updatedPost = db.post.update({
      where: { id: { equals: req.params.postId } },
      data,
    });
    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json(serializePost(updatedPost))
    );
  }),

  rest.get("/fakeApi/posts/:postId/comments", (req, res, ctx) => {
    const post = db.post.findFirst({
      where: { id: { equals: req.params.postId } },
    });
    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json({ comments: post.comments })
    );
  }),

  rest.post("/fakeApi/posts/:postId/reactions", (req, res, ctx) => {
    const postId = req.params.postId;
    const reaction = req.body.reaction;
    const post = db.post.findFirst({
      where: { id: { equals: postId } },
    });

    const updatedPost = db.post.update({
      where: { id: { equals: postId } },
      data: {
        reactions: {
          ...post.reactions,
          [reaction]: (post.reactions[reaction] += 1),
        },
      },
    });

    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.json(serializePost(updatedPost))
    );
  }),
  rest.get("/fakeApi/notifications", (req, res, ctx) => {
    const numNotifications = getRandomInt(1, 5);

    let notifications = generateRandomNotifications(
      undefined,
      numNotifications,
      db
    );

    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(notifications));
  }),
  rest.get("/fakeApi/users", (req, res, ctx) => {
    return res(ctx.delay(ARTIFICIAL_DELAY_MS), ctx.json(db.user.getAll()));
  }),
];

export const worker = setupWorker(...handlers);
