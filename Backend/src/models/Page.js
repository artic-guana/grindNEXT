import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "Untitled",
      trim: true,
    },

    icon: {
      type: String,
      default: "📄",
    },

    cover: {
      type: String,
      default: "",
    },

    // Tiptap/Notion-like editor JSON can be stored here.
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    parentPage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
      default: null,
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

pageSchema.index({ userId: 1, parentPage: 1 });

export default mongoose.model("Page", pageSchema);
