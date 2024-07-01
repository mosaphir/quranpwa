﻿import Select from 'react-select';
import { Recitaion, Translation, WbwTranslation } from '../QuranData';
import { groupBy } from '../Utilities';
import recitationList from '../assets/recitation-list.json';
import tafsirList from '../assets/tafsir-list.json';
import translationList from '../assets/translation-list.json';
import wbwTranslationList from '../assets/wbw-translation-list.json';
import ThemeSwitch from './ThemeSwitch';
import { Link } from 'react-router-dom';
import { getDefaultSettings } from '../StoredData';
import TranslationList from './TranslationList';

function SettingsPanel({ settingsData, onChange }: SettingsPanelProps) {

    const handleReadingModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = event.target.value;
        const selectedReadingMode: ReadingMode = ReadingMode[selectedItem as keyof typeof ReadingMode];
        settingsData.readingMode = selectedReadingMode;
        onChange(settingsData);
    };

    const handleQuranFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedItem = event.target.value;
        settingsData.quranFont = selectedItem;
        onChange(settingsData);
    };

    const handleShowQuranTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showQuranText = event.target.checked;
        onChange(settingsData);
    };

    const handleShowWbwChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showWbw = event.target.checked;
        onChange(settingsData);
    };

    const handleShowWbwTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showWbwTranslation = event.target.checked;
        onChange(settingsData);
    };

    const handleShowTranslationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showTranslation = event.target.checked;
        onChange(settingsData);
    };

    const handleShowTafsirChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        settingsData.showTafsir = event.target.checked;
        onChange(settingsData);
    };

    const hasSettingsChanged = () => {
        return JSON.stringify(settingsData) != JSON.stringify(getDefaultSettings())
    };

    const handleResetSettings = () => {
        settingsData = getDefaultSettings()
        onChange(settingsData);
    };

    const wbwTranslationItemsMapToSelectOption = (translationItems: WbwTranslation[]) => {
        return translationItems?.map(t => {
            return {
                label: t?.name,
                value: t
            }
        }) ?? []
    }

    const recitaionsMapToSelectOption = (recitaions: Recitaion[]) => {
        return recitaions?.map(t => {
            let tags = [];

            if (t.byWBW)
                tags.push('WBW');

            if (t.isFilePerVerse)
                tags.push('With Gap');

            let label = tags.length > 0 ? t?.name + ' (' + tags.join(', ') + ')' : t?.name;

            return { label: label, value: t }
        }) ?? []
    }

    const translationsGroupByLang = groupBy(translationList, x => x.language);
    const tafsirsGroupByLang = groupBy(tafsirList, x => x.language);

    return <div className="offcanvas offcanvas-end" id="offcanvasRight" data-bs-theme="light" data-bs-scroll="true" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
            <h4 id="offcanvasRightLabel">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-sliders2 me-2" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                </svg>
                Settings
            </h4>
            <button type="button" className="btn-close bg-light" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
            <h5>Translations
                <small className="badge bg-secondary mx-1" style={{ fontSize: '0.8rem' }}>Total: {translationList.length}</small>
                <small className="badge bg-secondary" style={{ fontSize: '0.8rem' }}>Languages: {Object.keys(translationsGroupByLang).length}</small>
            </h5>
            <TranslationList translationList={translationList}
                selectedTranslations={settingsData.translations}
                onChange={checkedTranslations => {
                    settingsData.translations = checkedTranslations;
                    onChange(settingsData)
                }} />
            <h5 className="mt-3">Word-by-word
                <small className="badge bg-secondary mx-1" style={{ fontSize: '0.8rem' }}>Total: {wbwTranslationList.length}</small>
            </h5>
            <Select isMulti blurInputOnSelect
                options={wbwTranslationItemsMapToSelectOption(wbwTranslationList)}
                value={wbwTranslationItemsMapToSelectOption(settingsData.wbwTranslations)}
                onChange={selectedOptions => {
                    settingsData.wbwTranslations = selectedOptions.map(m => m.value)
                    onChange(settingsData)
                }} />

            <h5 className="mt-3">Tafsirs
                <small className="badge bg-secondary mx-1" style={{ fontSize: '0.8rem' }}>Total: {tafsirList.length}</small>
                <small className="badge bg-secondary" style={{ fontSize: '0.8rem' }}>Languages: {Object.keys(tafsirsGroupByLang).length}</small>
            </h5>
            <TranslationList translationList={tafsirList}
                selectedTranslations={settingsData.tafsirs}
                onChange={checkedTafsirs => {
                    settingsData.tafsirs = checkedTafsirs;
                    onChange(settingsData)
                }} />
            <hr />

            <h5 className="mt-3">Recitaions</h5>
            <Select isMulti blurInputOnSelect
                options={recitaionsMapToSelectOption(recitationList)}
                value={recitaionsMapToSelectOption(settingsData.recitaions || recitationList.filter(f => f.id == 'Alafasy_128kbps'))}
                onChange={selectedOptions => {
                    settingsData.recitaions = selectedOptions.map(m => m.value)
                    onChange(settingsData)
                }} />
            <hr />

            <h5>Layout</h5>
            <div className="row">
                <label className="col-sm-5 col-form-label" htmlFor="ReadingModeSelect">Reading Mode</label>
                <div className="col-sm-7">
                    <select id="ReadingModeSelect" className="form-select"
                        value={ReadingMode[settingsData.readingMode]}
                        onChange={handleReadingModeChange}>
                        {Object.keys(ReadingMode).filter(f => isNaN(f as any)).map(item =>
                            <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>

                <h6>Contents</h6>
                <div className="form-check ms-2">
                    <input className="form-check-input" type="checkbox" id="ShowQuranTextInput"
                        checked={settingsData.showQuranText}
                        onChange={handleShowQuranTextChange} />
                    <label className="form-check-label" htmlFor="ShowQuranTextInput">Show Quran Text</label>
                </div>
                <div className="form-check ms-2">
                    <input className="form-check-input" type="checkbox" id="ShowWbwInput"
                        checked={settingsData.showWbw}
                        onChange={handleShowWbwChange} />
                    <label className="form-check-label" htmlFor="ShowWbwInput">Show Word By Word</label>
                </div>
                <div className="form-check ms-2">
                    <input className="form-check-input" type="checkbox" id="showWbwTranslationInput"
                        checked={settingsData.showWbwTranslation}
                        onChange={handleShowWbwTranslationChange} />
                    <label className="form-check-label" htmlFor="showWbwTranslationInput">Show Word By Word Translation</label>
                </div>
                <div className="form-check ms-2">
                    <input className="form-check-input" type="checkbox" id="showTranslationInput"
                        checked={settingsData.showTranslation}
                        onChange={handleShowTranslationChange} />
                    <label className="form-check-label" htmlFor="showTranslationInput">Show Translation</label>
                </div>
                <div className="form-check ms-2">
                    <input className="form-check-input" type="checkbox" id="showTafsirInput"
                        checked={settingsData.showTafsir}
                        onChange={handleShowTafsirChange} />
                    <label className="form-check-label" htmlFor="showTafsirInput">Show Tafsir</label>
                </div>
            </div>

            <h5 className="mt-3">Quran Font</h5>
            <div className="row">
                <label className="col-sm-5 col-form-label" htmlFor="QuranFontSelect">Quran Font</label>
                <div className="col-sm-7">
                    <select id="QuranFontSelect" className="form-select"
                        value={settingsData.quranFont}
                        onChange={handleQuranFontChange}>
                        <option value="hafs">KFGQPC HAFS</option>
                        <option value="me_quran">Me Quran</option>
                        <option value="amiri_quran">Amiri Quran</option>
                        <option value="kitab">Kitab</option>
                        <option value="noorehidayat">Noore Hidayat</option>
                        <option value="noorehira">Noore Hira</option>
                        <option value="noorehuda">Noore Huda</option>
                    </select>
                </div>
            </div>
            <hr />

            <h5>Themes</h5>
            <ThemeSwitch />
            <hr />
            <button type="button"
                className={hasSettingsChanged() ? "btn btn-danger border" : "btn btn-danger border disabled"}
                onClick={handleResetSettings}>
                Reset Settings
            </button>
            <Link to="/about" className="btn btn-info border">About Quran PWA</Link>
        </div>
    </div>;
}

export default SettingsPanel

export enum ReadingMode {
    Ayat_By_Ayat,
    Ruku_By_Ruku,
    //FullSura
}

export interface SettingsModel {
    readingMode: ReadingMode,
    showQuranText: boolean,
    showWbw: boolean,
    showWbwTranslation: boolean,
    showTranslation: boolean,
    showTafsir: boolean,
    quranFont: string,
    wbwTranslations: WbwTranslation[]
    translations: Translation[]
    tafsirs: Translation[]
    recitaions: Recitaion[]
}

interface SettingsPanelProps {
    settingsData: SettingsModel,
    onChange: (model: SettingsModel) => void
}
