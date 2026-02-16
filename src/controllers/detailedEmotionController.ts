import { Request, Response } from "express";
import * as DetailedEmotionService from "@/services/detailedEmotionService";
import {
  CreateDetailedEmotionInput,
  UpdateDetailedEmotionInput,
} from "@/schemas/detailedEmotion";

type IdParams = { id: string };

/**
 * POST /api/detailed-emotions
 */
export const createDetailedEmotion = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateDetailedEmotionInput;
    const detailedEmotion = await DetailedEmotionService.createDetailedEmotion(
      data
    );

    res.status(201).json({
      success: true,
      data: detailedEmotion,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "BASE_EMOTION_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Base emotion not found",
        });
      }

      if (error.message === "DETAILED_EMOTION_NAME_ALREADY_EXISTS_IN_BASE") {
        return res.status(409).json({
          success: false,
          message:
            "A detailed emotion with this name already exists for this base emotion",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error creating detailed emotion",
    });
  }
};

/**
 * GET /api/detailed-emotions
 */
export const getAllDetailedEmotions = async (req: Request, res: Response) => {
  try {
    const detailedEmotions =
      await DetailedEmotionService.getAllDetailedEmotions();

    res.status(200).json({
      success: true,
      data: detailedEmotions,
      count: detailedEmotions.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving detailed emotions",
    });
  }
};

/**
 * GET /api/detailed-emotions/:id
 */
export const getDetailedEmotionById = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const detailedEmotion = await DetailedEmotionService.getDetailedEmotionById(
      id
    );

    res.status(200).json({
      success: true,
      data: detailedEmotion,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "DETAILED_EMOTION_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Detailed emotion not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving detailed emotion",
    });
  }
};

/**
 * PUT /api/detailed-emotions/:id
 */
export const updateDetailedEmotion = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data = req.body as UpdateDetailedEmotionInput;
    const detailedEmotion = await DetailedEmotionService.updateDetailedEmotion(
      id,
      data
    );

    res.status(200).json({
      success: true,
      data: detailedEmotion,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "DETAILED_EMOTION_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Detailed emotion not found",
        });
      }

      if (error.message === "BASE_EMOTION_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Base emotion not found",
        });
      }

      if (error.message === "DETAILED_EMOTION_NAME_ALREADY_EXISTS_IN_BASE") {
        return res.status(409).json({
          success: false,
          message:
            "A detailed emotion with this name already exists for this base emotion",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error updating detailed emotion",
    });
  }
};

/**
 * DELETE /api/detailed-emotions/:id
 */
export const deleteDetailedEmotion = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    await DetailedEmotionService.deleteDetailedEmotion(id);

    res.status(200).json({
      success: true,
      message: "Detailed emotion deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "DETAILED_EMOTION_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Detailed emotion not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting detailed emotion",
    });
  }
};

/**
 * GET /api/detailed-emotions/search?q=query&baseEmotionId=<cuid>
 */
export const searchDetailedEmotions = async (req: Request, res: Response) => {
  try {
    const filters = (req as any).validatedQuery || {};
    const detailedEmotions =
      await DetailedEmotionService.searchDetailedEmotions(filters);

    res.status(200).json({
      success: true,
      data: detailedEmotions,
      count: detailedEmotions.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching detailed emotions",
    });
  }
};
