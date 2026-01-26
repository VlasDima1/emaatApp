
import { Survey } from '../types';
import { fourDKLSurvey } from './fourDKL/index';
import { phq9Survey } from './phq9/index';
import { gad7Survey } from './gad7/index';
import { auditSurvey } from './audit/index';
import { catSurvey } from './cat/index';
import { vasPainSurvey } from './vasPain/index';
import { gfiSurvey } from './gfi/index';
import { hadsSurvey } from './hads/index';
import { fagerstromSurvey } from './fagerstrom/index';
import { mmrcSurvey } from './mmrc/index';
import { pam13Survey } from './pam13/index';
import { ccqSurvey } from './ccq/index';
import { zlmSurvey } from './zlm/index';
import { algemeenHartfalenSurvey } from './algemeenHartfalen/index';


export const SURVEYS: Survey[] = [
    zlmSurvey,
    ccqSurvey,
    algemeenHartfalenSurvey,
    fourDKLSurvey,
    phq9Survey,
    gad7Survey,
    hadsSurvey,
    auditSurvey,
    fagerstromSurvey,
    catSurvey,
    mmrcSurvey,
    vasPainSurvey,
    gfiSurvey,
    pam13Survey,
];
