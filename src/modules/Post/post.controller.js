import postModel from "../../../DB/Models/post.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import genrateUniqueString from "../../utils/generateUniqueString.js";

//======================= ADD POST API ====================

export const addPost = async (req, res, next) => {
  const { title, slug, imageUrl, type } = req.body;
  const { _id } = req.authUser;
  //create post
  const slugAlreadyAddedBefore = await postModel.findOne({ title, addedBy: _id });
    if (slugAlreadyAddedBefore) {
      return res.status(400).json({
        message: `${title} is already in your list`,
      });
  }

  const post = await postModel.create({
    title,
    slug,
    type,
    imageUrl,
    addedBy: _id,
  });

  res.status(201).json({
    success: true,
    message: `${title} Added to your favorites! Enjoy revisiting your top pick.`,
    data: post,
  });
};

//======================= LIKE OR UNLIKE API ====================
// export const likeOrUnLikePosts = async (req, res, next) => {
//   const { postId } = req.params;
//   const { _id } = req.authUser;
//   const { onModel } = req.body;

//   // check if product exists
//   const postExist = await postModel.findById(postId);
//   if (!postExist) return next(new Error("post not found", { cause: 404 }));

//   const isAlreadyLiked = await likesModel.findOne({
//     likedBy: _id,
//     likeDoneOnId: postId,
//   });

//   if (isAlreadyLiked) {
//     await likesModel.findByIdAndDelete(isAlreadyLiked._id);
//     postExist.numberOfLikes--;
//     await postExist.save();
//     return res.status(200).json({
//       message: "UnLiked successfully",
//       postExist,
//     });
//   }

//   //create like document
//   const like = await likesModel.create({
//     likedBy: _id,
//     onModel,
//     likeDoneOnId: postId,
//   });
//   postExist.numberOfLikes++;
//   await postExist.save();

//   return res.status(200).json({
//     message: "Liked done successfully",
//     data: like,
//     postExist,
//   });
// };

//======================= GET ALL LIKES ====================
// export const getAllLikeForProduct = async (req, res, next) => {
//   const likes = await likesModel
//     .find({ likeDoneOnId: req.params.postId })
//     .populate([
//       {
//         path: "likeDoneOnId",
//       },
//     ]);
//   res.status(200).json({ message: "success", data: likes });
// };

//======================= UPDATE POST ====================

// export const updatePost = async (req, res, next) => {
//   const { title, caption, oldPublicId } = req.body;
//   const { _id } = req.authUser;
//   const { postId } = req.params;

//   //check post
//   const post = await postModel.findOne({ addedBy: _id, _id: postId });
//   if (!post) return next(new Error("post not found", { cause: 404 }));
//   //update post
//   if (title) post.title = title;
//   if (caption) post.caption = caption;

//   if (oldPublicId) {
//     if (!req.file)
//       // delete old image from cloudinary
//       return next(new Error("please upload the new image", { cause: 404 }));
//     await cloudinaryConnection().uploader.destroy(oldPublicId);
//     // upload the new image to cloudinary
//     const { secure_url, public_id } =
//       await cloudinaryConnection().uploader.upload(req.file.path, {
//         folder: `posts/images/${_id}/${post.images[0].folderId}`,
//       });
//     post.images.map((image) => {
//       if (image.public_id === oldPublicId) {
//         image.public_id = public_id;
//         image.secure_url = secure_url;
//       }
//     });
//   }
//   await post.save();
//   res.status(200).json({
//     message: "Updated Done",
//     data: post,
//   });
// };

//======================= DELETE POST ====================

export const deletePost = async (req, res, next) => {
  const { _id } = req.authUser;
  const { postId } = req.body;

  // check post
  const post = await postModel.findOneAndDelete({ addedBy: _id, _id: postId });
  if (!post) return next(new Error("post not found", { cause: 404 }));
  res.status(200).json({
     success: true,
    message: "Deleted successfully",
  });
};

//======================= GET ALL POSTS ====================
export const getAllPosts = async (req, res, next) => {
  const { userId } = req.params;
  const posts = await postModel
    .find({ addedBy: userId })
    .sort({ createdAt: -1 });
  res.status(200).json({ message: "done", data: posts });
};
