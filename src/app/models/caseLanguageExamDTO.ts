export class CaseLanguageExamDTO {
    constructor() {
        this.id = 0;
    }

    id: number;
    isTakenExam: boolean;
    languageId: number;
    ieltsExamId: number;
    issueDate: Date;
    isOtherLanguageResult: boolean;
    speakingScore: number;
    listeningScore: number;
    readingScore: number;
    writingScore: number;
    languageName: string;
    ieltsExamName: string;
}