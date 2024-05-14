﻿import quranText from './assets/quran-texts/quran.json'
import quranData from './assets/quran-data.json'
import { NavigationModel } from './components/NavBar';
import { sum } from './Utilities';

export class QuranData {

    suras: Sura[];
    hizb_quarters: AyatRange[];
    manzils: AyatRange[];
    rukus: AyatRange[];
    pages: AyatRange[];
    sajdas: Sajdah[];
    juzs: AyatRange[];

    ayats: Ayat[] = [];
    translations: TranslationWithData[] = [];
    tafsirs: TranslationWithData[] = [];
    recitations: RecitaionWithData[] = [];

    constructor() {
        this.suras = this.getSuras();
        this.hizb_quarters = this.getHizbQuarters();
        this.manzils = this.getManzils();
        this.rukus = this.getRukus();
        this.pages = this.getPages();
        this.sajdas = this.getSajdas();
        this.juzs = this.getJuzs();

        this.setAyats(quranText);
    }

    private getSuras(): Sura[] {
        const r: Sura[] = [];
        let serial = 1;
        for (const sura of quranData.suras) {
            r.push({
                serial: serial++,
                start: +sura[0],
                ayas: +sura[1],
                order: +sura[2],
                rukus: +sura[3],
                name: sura[4].toString(),
                tname: sura[5].toString(),
                ename: sura[6].toString(),
                type: sura[7].toString(),
                end: +sura[0] + +sura[1]
            });
        }
        return r;
    }

    private getSajdas(): Sajdah[] {
        const r: Sajdah[] = [];
        for (const sajda of quranData.sajdas) {
            r.push({
                surah: +sajda[0],
                ayah: +sajda[1],
                recommended: sajda[2] === 'recommended' ? true : false,
                obligatory: sajda[2] === 'obligatory' ? true : false
            });
        }
        return r;
    }

    private getAyatRange(segments: number[][]): AyatRange[] {
        const r: AyatRange[] = [];
        for (let i = 0; i < segments.length; i++) {
            const [startingSuraNumber, segmentStartAyat] = segments[i];

            let startingSura = this.suras[startingSuraNumber - 1];

            let thisSegmentStart = startingSura.start + segmentStartAyat - 1;
            let thisSegmentEnd = 6236;

            if (i < segments.length - 1) {
                let [nextSegmentSuraNumber, nextSegmentStartAyat] = segments[i + 1];
                let nextSegmentSura = this.suras[nextSegmentSuraNumber - 1];
                let nextSegmentSuraStart = nextSegmentSura.start;

                thisSegmentEnd = nextSegmentSuraStart + nextSegmentStartAyat - 1;
            }

            r.push({
                serial: i + 1,
                start: thisSegmentStart,
                end: thisSegmentEnd,
                displayText: startingSura.tname + ':' + segmentStartAyat
            });
        }
        return r;
    }

    private getRukus(): AyatRange[] {
        return this.getAyatRange(quranData.rukus);
    }

    private getManzils() {
        return this.getAyatRange(quranData.manzils);
    }

    private getPages() {
        return this.getAyatRange(quranData.pages);
    }

    private getHizbQuarters() {
        return this.getAyatRange(quranData.hizb_quarters);
    }

    private getJuzs() {
        return this.getAyatRange(quranData.juzs);
    }

    getMaxNavSerial(navMode: NavigationMode) {
        let maxSerial = 0;

        if (navMode == NavigationMode.Sura) {
            maxSerial = this.suras.length;

        } else if (navMode == NavigationMode.Juz) {
            maxSerial = this.juzs.length;

        } else if (navMode == NavigationMode.Hizb) {
            maxSerial = this.hizb_quarters.length;

        } else if (navMode == NavigationMode.Ruku) {
            maxSerial = this.rukus.length;

        } else if (navMode == NavigationMode.Page) {
            maxSerial = this.pages.length;
        }

        return maxSerial;
    }

    getAyatRangeByNavSerial(navMode: NavigationMode, serial: number): { start: number, end: number, displayText: string } {
        let start = 0;
        let end = 7;
        let displayText = '';

        if (navMode == NavigationMode.Sura) {
            const sura = this.suras[serial - 1];
            start = sura?.start;
            end = sura?.start + sura?.ayas;
            displayText = sura?.tname;

        } else if (navMode == NavigationMode.Juz) {
            const jus = this.juzs[serial - 1];
            start = jus?.start;
            end = jus?.end;
            displayText = jus?.displayText;

        } else if (navMode == NavigationMode.Hizb) {
            const hizb = this.hizb_quarters[serial - 1];
            start = hizb?.start;
            end = hizb?.end;
            displayText = hizb?.displayText;

        } else if (navMode == NavigationMode.Ruku) {
            const ruku = this.rukus[serial - 1];
            start = ruku?.start;
            end = ruku?.end;
            displayText = ruku?.displayText;

        } else if (navMode == NavigationMode.Page) {
            const page = this.pages[serial - 1];
            start = page?.start;
            end = page?.end;
            displayText = page?.displayText;
        }

        return { start: start, end: end, displayText: displayText };
    }

    setAyats(quranTexts: string[]) {
        if (this.ayats.length >= 6236)
            return;

        let serial = 1;
        let serialInSura = 1;

        for (let quranText of quranTexts) {
            let sura = this.suras.filter(f => serial >= f.start && serial <= f.end)[0];
            let juz = this.juzs.filter(f => serial >= f.start && serial <= f.end)[0];
            let hizb = this.hizb_quarters.filter(f => serial >= f.start && serial <= f.end)[0];
            let page = this.pages.filter(f => serial >= f.start && serial <= f.end)[0];
            let ruku = this.rukus.filter(f => serial >= f.start && serial <= f.end)[0];

            if (this.ayats.length > 0
                && this.ayats[this.ayats.length - 1]?.suraIdx != sura.serial - 1) {
                serialInSura = 1;
            }

            this.ayats.push({
                serial: serial++,
                arabicText: quranText,
                suraIdx: sura.serial - 1,
                serialInSura: serialInSura++,
                juzIdx: juz.serial - 1,
                hizbIdx: hizb.serial - 1,
                pageIdx: page.serial - 1,
                rukuIdx: ruku.serial - 1,
                charLength: quranText.length
            });
        }
    }

    setTranslations(translations: Translation[], updateUI: () => void) {
        this.translations = this.translations.filter(f =>
            translations.some(s => s.fileName === f.translationMeta.fileName));

        let notFetchedTranslations = translations.filter(f =>
            !this.translations.some(s => s.translationMeta.fileName === f.fileName));

        notFetchedTranslations.forEach(translation => {
            fetch(`./translations/${translation.fileName}.json`)
                .then<string[]>(response => response.json())
                .then(texts => {
                    if (!this.translations.some(s => s.translationMeta.fileName === translation.fileName)) {

                        this.translations.push({ translationMeta: translation, texts: texts });

                        const isLastTranslationToFetch = notFetchedTranslations.indexOf(translation) == notFetchedTranslations.length - 1;
                        if (isLastTranslationToFetch)
                            updateUI();
                    }
                })
                .catch(error => console.error(error));
        });

        if (notFetchedTranslations.length == 0)
            updateUI();

    }

    setTafsirs(tafsirs: Translation[], updateUI: () => void) {
        this.tafsirs = this.tafsirs.filter(f =>
            tafsirs.some(s => s.fileName === f.translationMeta.fileName));

        let notFetchedTafsirs = tafsirs.filter(f =>
            !this.tafsirs.some(s => s.translationMeta.fileName === f.fileName));

        notFetchedTafsirs.forEach(translation => {
            fetch(`./tafsirs/${translation.fileName}.json`)
                .then<string[]>(response => response.json())
                .then(texts => {
                    if (!this.tafsirs.some(s => s.translationMeta.fileName === translation.fileName)) {

                        this.tafsirs.push({ translationMeta: translation, texts: texts });

                        const isLastTranslationToFetch = notFetchedTafsirs.indexOf(translation) == notFetchedTafsirs.length - 1;
                        if (isLastTranslationToFetch)
                            updateUI();
                    }
                })
                .catch(error => console.error(error));
        });

        if (notFetchedTafsirs.length == 0)
            updateUI();
    }

    setRecitations(recitations: Recitaion[]) {
        this.recitations = this.recitations.filter(f =>
            recitations.some(s => s.id === f.recitaionMeta.id));

        let notFetchedRecitationTimings = recitations.filter(f =>
            !this.recitations.some(s => s.recitaionMeta.id === f.id));

        notFetchedRecitationTimings.forEach(recitation => {
            if (recitation.bySura) {
                fetch(`./recitaion-timings/${recitation.id}.json`)
                    .then<[]>(response => response.json())
                    .then(timings => {
                        if (!this.recitations.some(s => s.recitaionMeta.id === recitation.id)) {

                            this.recitations.push({ recitaionMeta: recitation, timings: timings });
                        }
                    })
                    .catch(error => console.error(error));
            } else {
                this.recitations.push({ recitaionMeta: recitation, timings: [] });
            }
        });
    }

    getLengthInMinutes(ayatRange: Sura | AyatRange) {
        if (!ayatRange.readingTimeInSecond) {
            let ayats: Ayat[] = this.ayats.slice(ayatRange.start, ayatRange.end);

            ayatRange.charLength = sum(ayats.map(m => m.charLength));

            const charPerSecond = 6.4;
            ayatRange.readingTimeInSecond = ayatRange.charLength / charPerSecond;
        }

        return Math.ceil(ayatRange.readingTimeInSecond / 60);
    }

    static get instance() {
        const globalQuranData = "globalQuranData";

        if (!(window as any)[globalQuranData])
            (window as any)[globalQuranData] = new QuranData();

        return (window as any)[globalQuranData]
    }
}

export interface Sura {
    serial: number,
    start: number,
    end: number,
    ayas: number,
    order: number,
    rukus: number,
    name: string,
    tname: string,
    ename: string,
    type: string,
    charLength?: number,
    readingTimeInSecond?: number
}

export interface AyatRange {
    serial: number,
    start: number,
    end: number,
    displayText: string,
    charLength?: number
    readingTimeInSecond?: number
}

interface Sajdah {
    surah: number,
    ayah: number,
    recommended: boolean,
    obligatory: boolean
}

export interface Translation {
    Name: string,
    languageName: string,
    translator: string,
    fileName: string,
    language: string,
    locale: string | null,
}

export interface TranslationWithData {
    translationMeta: Translation,
    texts: string[]
}

export interface Ayat {
    serial: number,
    serialInSura: number,
    arabicText: string,
    suraIdx: number,
    juzIdx: number,
    hizbIdx: number,
    pageIdx: number,
    rukuIdx: number,
    charLength: number,
}

export interface Recitaion {
    id: string,
    name: string,
    language: string,
    url: string,
    byWord: boolean,
    byVerse: boolean,
    bySura: boolean,
    style: string
}

export interface RecitaionWithData {
    recitaionMeta: Recitaion,
    timings: Array<[number, number, number]>
}

export enum NavigationMode {
    Sura,
    Juz,
    Hizb,
    Ruku,
    Page,
}

export enum NavigationShortcutType {
    Recents,
    Bookmarks,
    QuickLinks,
}

export interface NavigationShortcutItem {
    displayText: string,
    navData: NavigationModel,
    link: string,
    date: Date
}
