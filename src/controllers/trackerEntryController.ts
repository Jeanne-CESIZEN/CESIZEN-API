import { Request, Response } from "express";
import * as TrackerEntryService from "@/services/trackerEntryService";
import {
  CreateTrackerEntryInput,
  UpdateTrackerEntryInput,
} from "@/schemas/trackerEntry";
import { Role } from "@/generated/prisma";

type IdParams = { id: string };
type UserIdParams = { userId: string };
type AuthUser = { id: string; role: Role };

const getAuthUser = (req: Request): AuthUser => {
  return (req as any).authUser as AuthUser;
};

/**
 * POST /api/tracker-entries
 */
export const createTrackerEntry = async (req: Request, res: Response) => {
  try {
    const authUser = getAuthUser(req);
    let data = req.body as CreateTrackerEntryInput;

    if (authUser.role !== Role.ADMIN) {
      data = {
        ...data,
        userId: authUser.id,
      };
    }

    const trackerEntry = await TrackerEntryService.createTrackerEntry(data);

    res.status(201).json({
      success: true,
      data: trackerEntry,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (error.message === "DETAILED_EMOTION_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Detailed emotion not found",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error creating tracker entry",
    });
  }
};

/**
 * GET /api/tracker-entries
 */
export const getAllTrackerEntries = async (req: Request, res: Response) => {
  try {
    const authUser = getAuthUser(req);
    const trackerEntries =
      authUser.role === Role.ADMIN
        ? await TrackerEntryService.getAllTrackerEntries()
        : await TrackerEntryService.getTrackerEntriesByUser(authUser.id);

    res.status(200).json({
      success: true,
      data: trackerEntries,
      count: trackerEntries.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving tracker entries",
    });
  }
};

/**
 * GET /api/tracker-entries/user/:userId
 */
export const getTrackerEntriesByUser = async (
  req: Request<UserIdParams>,
  res: Response
) => {
  try {
    const authUser = getAuthUser(req);
    const { userId } = req.params;

    if (authUser.role !== Role.ADMIN && userId !== authUser.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const trackerEntries = await TrackerEntryService.getTrackerEntriesByUser(
      userId
    );

    res.status(200).json({
      success: true,
      data: trackerEntries,
      count: trackerEntries.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving tracker entries for user",
    });
  }
};

/**
 * GET /api/tracker-entries/:id
 */
export const getTrackerEntryById = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;
    const trackerEntry = await TrackerEntryService.getTrackerEntryById(id);

    if (authUser.role !== Role.ADMIN && trackerEntry.userId !== authUser.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    res.status(200).json({
      success: true,
      data: trackerEntry,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TRACKER_ENTRY_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Tracker entry not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving tracker entry",
    });
  }
};

/**
 * PUT /api/tracker-entries/:id
 */
export const updateTrackerEntry = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;
    const existingTrackerEntry = await TrackerEntryService.getTrackerEntryById(id);

    if (
      authUser.role !== Role.ADMIN &&
      existingTrackerEntry.userId !== authUser.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    let data = req.body as UpdateTrackerEntryInput;

    if (authUser.role !== Role.ADMIN) {
      data = {
        ...data,
        userId: authUser.id,
      };
    }

    const trackerEntry = await TrackerEntryService.updateTrackerEntry(id, data);

    res.status(200).json({
      success: true,
      data: trackerEntry,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "TRACKER_ENTRY_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Tracker entry not found",
        });
      }

      if (error.message === "USER_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (error.message === "DETAILED_EMOTION_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Detailed emotion not found",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error updating tracker entry",
    });
  }
};

/**
 * DELETE /api/tracker-entries/:id
 */
export const deleteTrackerEntry = async (
  req: Request<IdParams>,
  res: Response
) => {
  try {
    const authUser = getAuthUser(req);
    const { id } = req.params;
    const trackerEntry = await TrackerEntryService.getTrackerEntryById(id);

    if (authUser.role !== Role.ADMIN && trackerEntry.userId !== authUser.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    await TrackerEntryService.deleteTrackerEntry(id);

    res.status(200).json({
      success: true,
      message: "Tracker entry deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "TRACKER_ENTRY_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Tracker entry not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting tracker entry",
    });
  }
};

/**
 * GET /api/tracker-entries/search?q=query&userId=<cuid>&detailedEmotionId=<cuid>
 */
export const searchTrackerEntries = async (req: Request, res: Response) => {
  try {
    const authUser = getAuthUser(req);
    const filters = (req as any).validatedQuery || {};
    const securedFilters =
      authUser.role === Role.ADMIN
        ? filters
        : {
            ...filters,
            userId: authUser.id,
          };
    const trackerEntries = await TrackerEntryService.searchTrackerEntries(
      securedFilters
    );

    res.status(200).json({
      success: true,
      data: trackerEntries,
      count: trackerEntries.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching tracker entries",
    });
  }
};
