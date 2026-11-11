import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractLocationFromQuery,
  getDynamicPlaceTelemetry,
  buildLocalRAGResponse,
  recommendCircuitsForPlanner,
} from './ragEngine';
import { CIRCUITS_DATA } from '../data/uttarakhandData';

describe('Uttarakhand Dynamic RAG & Circuit Planner Engine', () => {
  it('parses known gazetteer locations and arbitrary Uttarakhand villages accurately', () => {
    assert.equal(extractLocationFromQuery('What is the weather in Munsiyari today?'), 'Munsiyari');
    assert.equal(extractLocationFromQuery('Current weather in Chopta circuit?'), 'Chopta');
    assert.equal(extractLocationFromQuery('Tell me about permits in Pithoragarh'), 'Pithoragarh');
    assert.equal(extractLocationFromQuery('weather in Kausani'), 'Kausani');
    assert.equal(extractLocationFromQuery('weather in Abbott Mount'), 'Abbott Mount');
    assert.equal(extractLocationFromQuery('weather in Chaukori right now'), 'Chaukori');
  });

  it('generates deterministic, realistic telemetry for both gazetteer and unindexed villages', () => {
    const chopta = getDynamicPlaceTelemetry('Chopta');
    assert.equal(chopta.region, 'Garhwal');
    assert.equal(chopta.district, 'Rudraprayag');
    assert.ok(chopta.elevationMeters > 2000);

    const chaukori = getDynamicPlaceTelemetry('Chaukori');
    assert.equal(chaukori.placeName, 'Chaukori');
    assert.equal(chaukori.region, 'Kumaon');
    assert.ok(chaukori.temperatureC >= 1 && chaukori.temperatureC <= 25);
  });

  it('builds structured RAG responses for weather, permits, homestays, and cultural etiquette', () => {
    const weatherRes = buildLocalRAGResponse('weather in Nainital');
    assert.equal(weatherRes.intentType, 'weather');
    assert.equal(weatherRes.targetLocation, 'Nainital');
    assert.ok(weatherRes.formattedResponse.includes('Live Micro-Climate Report: Nainital'));

    const etiquetteRes = buildLocalRAGResponse('Local customs for homestay etiquette');
    assert.equal(etiquetteRes.intentType, 'etiquette');
    assert.ok(etiquetteRes.formattedResponse.includes('Pahadi Homestay Etiquette'));
  });

  it('recommends matching circuits in the Interactive Circuit Planner based on duration, interests, and budget', () => {
    const kausaniMatch = recommendCircuitsForPlanner(CIRCUITS_DATA, {
      durationBucket: 'short',
      interests: ['wellness', 'heritage'],
      maxBudgetInr: 10000,
      region: 'Kumaon',
    });
    assert.equal(kausaniMatch.primaryCircuit.id, 'cir-kausani');
    assert.ok(kausaniMatch.matchScorePercent >= 85);
    assert.ok(kausaniMatch.carbonSavedKg > 0);
  });
});
