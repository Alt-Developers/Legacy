import express, { Request, Response, NextFunction } from "express";
import { Document, ObjectId } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      [key: string]: any;
      user: UserInterface;
    }
  }
  interface Error {
    statusCode: number;
    type?: string;
    header?: string;
    location?: string;
    modal?: boolean;
  }
}

export type AvaliableSchool =
  | "ASSUMPTION"
  | "NEWTON"
  | "ESSENCE"
  | "ESSENCEP"
  | "SATHIT_PRATHUMWAN"
  | "ASSUMPTION_THON"
  | string;

export type ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export interface Count extends Document {
  apiName: string;
  count: number;
}

export interface PlayerInterface extends Document {
  realName: string;
  codeName: string;
  score: number;
  createdBy: ObjectId;
}

export interface UserInterface extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  DOB?: Date;
  accType: "developer" | "user";
  system13?: ObjectId[];
  expenses?: ObjectId[];
  preferredColor: string;
  timetables?: {
    preferredColor: string;
    modalId: ObjectId[];
    primaryClass: ObjectId;
    starred: ObjectId[];
    created: ObjectId[];
  };
  preferredConfig: {
    language: "TH" | "EN" | string;
    dateTime: "24h" | "12h" | string;
    showCovid: "showCov" | "hideCov" | string;
    tmrPref: "subject" | "book" | "hide" | string;
  };
  passwordChangedAt?: Date;
  status: boolean;
}

export interface UnlockedObjectInterface extends Object {
  [key: string]: any;
}

export interface ExpensesInterface extends Document {
  name: string;
  type: string;
  amount: number;
  detail?: string;
  createdBy: ObjectId;
  createdAt: Date;
}

export interface TimetableContentInterface extends Object {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
}

export interface TimetableInterface extends Document {
  classNo: string;
  year: string;
  program: string;
  school: string;
  color: string;
  timetableContent: TimetableContentInterface;
  createdBy: ObjectId;
  status: "outdated" | "uptodate";
}

export interface ClassesInterface extends Document {
  classNo: string;
  program: string;
  school: string;
  timetable: ObjectId;
  primaryClassOf: ObjectId[];
  defaultColor: string;
}

export interface codeInterface extends Document {
  programCode: string;
  programName: string;
  school: string;
  classCode: {
    EN: Object;
    TH: Object;
  };
}

export interface UniversalCodeInterface extends Document {
  school: string;
  universalCodes: {
    EN: Object;
    TH: Object;
  };
}

export interface HolidayInterface extends Document {
  type: "specific" | "public";
  school: "ALL" | AvaliableSchool | string;
  name: {
    TH: string;
    EN: string;
  };
  desc: {
    TH: string;
    EN: string;
  };
  date: string;
  addedBy: ObjectId;
}

export interface ClassInfoInterface {
  year: string;
  classNo: string;
  school: "ASSUMPTION" | "NEWTON" | "ESSENCE" | string;
  program: string;
}

export interface TimetableRequestInterface extends Document {
  status: "closed" | "open" | "rejected" | string;
  type: "new" | "update";
  classInfo: ClassInfoInterface;
  timetableImagePath: string;
  uploadedBy: ObjectId;
}

export interface TimeLayoutInterface extends Document {
  school: AvaliableSchool;
  program: string;
  time: string[];
}

export interface ModalDataInterface {
  modalName: string;
  displayMode: "SCHOOL" | "ALL" | "SPECIAL";
  displayTo?: AvaliableSchool;
  header: string;
  message: string;
  type: "important" | "prompt" | string;
}
